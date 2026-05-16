const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Submit book request
router.post('/', authenticate, [
  body('title').notEmpty().trim(),
  body('author').notEmpty().trim(),
  body('published_year').optional().isInt(),
  body('genre').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, author, published_year, genre } = req.body;

    const { data, error } = await supabase
      .from('book_requests')
      .insert({
        user_id: req.userId,
        title,
        author,
        published_year,
        genre
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Request submitted', request: data });
  } catch (error) {
    console.error('Book request error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Get user's requests
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('book_requests')
      .select('*')
      .eq('user_id', req.userId)
      .order('request_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get all requests (admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status } = req.query;
    let query = supabase
      .from('book_requests')
      .select('*, users(user_id, username, email)')
      .order('request_date', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Update request status (admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('book_requests')
      .update({ status })
      .eq('request_id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Request updated', request: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Accept request (admin) - adds book to library
router.post('/:id/accept', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Get the request
    const { data: request } = await supabase
      .from('book_requests')
      .select('*')
      .eq('request_id', id)
      .single();

    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Add book to library
    const { error: bookError } = await supabase
      .from('books')
      .insert({
        title: request.title,
        author: request.author,
        published_year: request.published_year,
        genre: request.genre,
        available: 1
      });

    if (bookError) throw bookError;

    // Update request status
    await supabase
      .from('book_requests')
      .update({ status: 'accepted' })
      .eq('request_id', id);

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: request.user_id,
        message: `Your book request for "${request.title}" has been accepted and added to the library.`
      });

    res.json({ message: 'Request accepted, book added to library' });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Reject request (admin)
router.post('/:id/reject', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const { data: request } = await supabase
      .from('book_requests')
      .select('user_id, title')
      .eq('request_id', id)
      .single();

    if (!request) return res.status(404).json({ error: 'Request not found' });

    await supabase
      .from('book_requests')
      .update({ status: 'rejected' })
      .eq('request_id', id);

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: request.user_id,
        message: `Your book request for "${request.title}" has been rejected.`
      });

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

module.exports = router;