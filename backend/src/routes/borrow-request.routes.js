const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Borrowing limits
const MAX_CONCURRENT_BORROWS = 3;
const MAX_MONTHLY_BORROWS = 5;

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

const isAdmin = async (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Helper function to check borrowing limits
const checkBorrowingLimits = async (userId) => {
  // Check concurrent borrows
  const { count: concurrentCount } = await supabase
    .from('borrowed_books')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_borrowed', true);

  // Check monthly borrows
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyCount } = await supabase
    .from('borrowed_books')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('borrow_date', firstDayOfMonth.toISOString());

  return {
    concurrentCount: concurrentCount || 0,
    monthlyCount: monthlyCount || 0,
    canBorrow: concurrentCount < MAX_CONCURRENT_BORROWS && monthlyCount < MAX_MONTHLY_BORROWS,
    concurrentLimitReached: concurrentCount >= MAX_CONCURRENT_BORROWS,
    monthlyLimitReached: monthlyCount >= MAX_MONTHLY_BORROWS
  };
};

// Submit a borrow request
router.post('/', authenticate, [
  body('book_id').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { book_id } = req.body;
    const userId = req.userId;

    // Check if user already has a pending request for this book
    const { data: existingRequest } = await supabase
      .from('borrow_requests')
      .select('request_id')
      .eq('book_id', book_id)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending request for this book' });
    }

    // Check if user already borrowed this book
    const { data: existingBorrow } = await supabase
      .from('borrowed_books')
      .select('borrow_id')
      .eq('book_id', book_id)
      .eq('user_id', userId)
      .eq('is_borrowed', true)
      .single();

    if (existingBorrow) {
      return res.status(400).json({ error: 'You already have this book borrowed' });
    }

    // Check borrowing limits
    const limits = await checkBorrowingLimits(userId);
    if (limits.concurrentLimitReached) {
      return res.status(400).json({ error: `You have reached the maximum of ${MAX_CONCURRENT_BORROWS} concurrent borrows` });
    }
    if (limits.monthlyLimitReached) {
      return res.status(400).json({ error: `You have reached your monthly limit of ${MAX_MONTHLY_BORROWS} borrows` });
    }

    // Check if book is available
    const { data: book } = await supabase
      .from('books')
      .select('available')
      .eq('id', book_id)
      .single();

    if (!book || book.available < 1) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Create borrow request
    const { data, error } = await supabase
      .from('borrow_requests')
      .insert({
        book_id,
        user_id: userId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Borrow request submitted', request: data });
  } catch (error) {
    console.error('Borrow request error:', error);
    res.status(500).json({ error: 'Failed to submit borrow request' });
  }
});

// Get user's borrow requests
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        *,
        books (id, title, author, cover_image_url)
      `)
      .eq('user_id', req.userId)
      .order('request_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrow requests' });
  }
});

// Get user's current borrowing status (limits info)
router.get('/my-limits', authenticate, async (req, res) => {
  try {
    const limits = await checkBorrowingLimits(req.userId);
    res.json({
      concurrent_borrows: limits.concurrentCount,
      monthly_borrows: limits.monthlyCount,
      max_concurrent: MAX_CONCURRENT_BORROWS,
      max_monthly: MAX_MONTHLY_BORROWS
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowing limits' });
  }
});

// Get all borrow requests (admin)
router.get('/all', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('borrow_requests')
      .select(`
        *,
        users (user_id, username, email),
        books (id, title, author, cover_image_url, available)
      `)
      .order('request_date', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrow requests' });
  }
});

// Get pending count (admin)
router.get('/pending-count', authenticate, isAdmin, async (req, res) => {
  try {
    const { count } = await supabase
      .from('borrow_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    res.json({ pending_count: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending count' });
  }
});

// Approve borrow request (admin)
router.post('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;

    // Get the request
    const { data: request } = await supabase
      .from('borrow_requests')
      .select('*, books(*)')
      .eq('request_id', id)
      .single();

    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request already processed' });

    // Re-check borrowing limits at approval time
    const limits = await checkBorrowingLimits(request.user_id);
    if (!limits.canBorrow) {
      // Update request status to rejected
      await supabase
        .from('borrow_requests')
        .update({ 
          status: 'rejected', 
          processed_date: new Date().toISOString(),
          admin_id: adminId,
          notes: 'Borrowing limits exceeded at time of approval'
        })
        .eq('request_id', id);

      return res.status(400).json({ error: 'User has exceeded borrowing limits' });
    }

    // Check if book is still available
    if (!request.books || request.books.available < 1) {
      await supabase
        .from('borrow_requests')
        .update({ 
          status: 'rejected', 
          processed_date: new Date().toISOString(),
          admin_id: adminId,
          notes: 'Book no longer available'
        })
        .eq('request_id', id);

      // Notify user
      await supabase
        .from('notifications')
        .insert({
          user_id: request.user_id,
          book_id: request.book_id,
          message: `Your borrow request for "${request.books?.title || 'a book'}" was rejected because the book is no longer available.`
        });

      return res.status(400).json({ error: 'Book is no longer available' });
    }

    // Create actual borrow record
    const { error: borrowError } = await supabase
      .from('borrowed_books')
      .insert({
        book_id: request.book_id,
        user_id: request.user_id,
        return_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (borrowError) throw borrowError;

    // Update request status
    await supabase
      .from('borrow_requests')
      .update({ 
        status: 'approved', 
        processed_date: new Date().toISOString(),
        admin_id: adminId
      })
      .eq('request_id', id);

    // Decrease available count
    await supabase
      .from('books')
      .update({ available: request.books.available - 1 })
      .eq('id', request.book_id);

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: request.user_id,
        book_id: request.book_id,
        message: `Your borrow request for "${request.books?.title}" has been approved! You can now pick up the book.`
      });

    res.json({ message: 'Borrow request approved' });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// Reject borrow request (admin)
router.post('/:id/reject', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;
    const { reason } = req.body;

    // Get the request
    const { data: request } = await supabase
      .from('borrow_requests')
      .select('*, books(title)')
      .eq('request_id', id)
      .single();

    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request already processed' });

    // Update request status
    await supabase
      .from('borrow_requests')
      .update({ 
        status: 'rejected', 
        processed_date: new Date().toISOString(),
        admin_id: adminId,
        notes: reason || null
      })
      .eq('request_id', id);

    // Notify user
    const notificationMessage = reason 
      ? `Your borrow request for "${request.books?.title || 'a book'}" was rejected: ${reason}`
      : `Your borrow request for "${request.books?.title || 'a book'}" was rejected.`;

    await supabase
      .from('notifications')
      .insert({
        user_id: request.user_id,
        book_id: request.book_id,
        message: notificationMessage
      });

    res.json({ message: 'Borrow request rejected' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

module.exports = router;