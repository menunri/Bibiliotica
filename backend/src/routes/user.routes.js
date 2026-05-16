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
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, username, email, mobile_number, address, created_at')
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/me', authenticate, [
  body('username').optional().trim().isLength({ min: 3 }),
  body('email').optional().isEmail(),
  body('mobile_number').optional(),
  body('address').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, mobile_number, address } = req.body;

    // Check if username/email already taken by another user
    if (username || email) {
      const { data: existing } = await supabase
        .from('users')
        .select('user_id')
        .or(`username.eq.${username || ''},email.eq.${email || ''}`)
        .neq('user_id', req.userId);

      if (existing && existing.length > 0) {
        return res.status(400).json({ error: 'Username or email already taken' });
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update({ username, email, mobile_number, address })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Profile updated', user: data });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get borrowed books count
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { count: borrowed } = await supabase
      .from('borrowed_books')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('is_borrowed', true);

    const { count: notifications } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('is_read', false);

    res.json({ borrowed_books: borrowed, unread_notifications: notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;