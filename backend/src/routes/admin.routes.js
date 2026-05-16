const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Dashboard stats
router.get('/dashboard', authenticate, isAdmin, async (req, res) => {
  try {
    const { count: users } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: books } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });

    const { count: borrowed } = await supabase
      .from('borrowed_books')
      .select('*', { count: 'exact', head: true })
      .eq('is_borrowed', true);

    const { count: returned } = await supabase
      .from('returned_books')
      .select('*', { count: 'exact', head: true });

    const { count: pendingRequests } = await supabase
      .from('book_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: unreadNotifications } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    res.json({
      total_users: users,
      total_books: books,
      currently_borrowed: borrowed,
      total_returned: returned,
      pending_requests: pendingRequests,
      unread_notifications: unreadNotifications
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, username, email, mobile_number, address, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all returned books history
router.get('/returned', authenticate, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('returned_books')
      .select('*, users(username), books(title)')
      .order('return_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch returned books' });
  }
});

// Admin stats by time period
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month', 'year'

    let startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const { count: newUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', startDate.toISOString());

    const { count: newBorrows } = await supabase
      .from('borrowed_books')
      .select('*', { count: 'exact', head: true })
      .gt('borrow_date', startDate.toISOString());

    const { count: newReturns } = await supabase
      .from('returned_books')
      .select('*', { count: 'exact', head: true })
      .gt('return_date', startDate.toISOString());

    res.json({
      period: period || 'all',
      new_users: newUsers,
      new_borrows: newBorrows,
      new_returns: newReturns
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;