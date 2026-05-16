const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
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

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all books (public)
router.get('/', async (req, res) => {
  try {
    const { genre, search, available } = req.query;

    let query = supabase.from('books').select('*');

    if (genre) query = query.eq('genre', genre);
    if (available !== undefined) query = query.gt('available', 0);
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get single book (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Book not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Add book (admin only)
router.post('/', authenticate, isAdmin, [
  body('title').notEmpty().trim(),
  body('author').notEmpty().trim(),
  body('published_year').optional().isInt(),
  body('genre').optional().trim(),
  body('available').optional().isInt({ min: 0 }),
  body('cover_image_url').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, author, published_year, genre, available, cover_image_url } = req.body;

    const { data, error } = await supabase
      .from('books')
      .insert({ title, author, published_year, genre, available: available || 1, cover_image_url })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Book added', book: data });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, published_year, genre, available, cover_image_url } = req.body;

    const { data, error } = await supabase
      .from('books')
      .update({ title, author, published_year, genre, available, cover_image_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Book updated', book: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) throw error;
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Get books by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('genre', genre)
      .gt('available', 0);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by genre' });
  }
});

module.exports = router;