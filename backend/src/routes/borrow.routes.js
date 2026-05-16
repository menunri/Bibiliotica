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

// Borrow a book
router.post('/borrow', authenticate, async (req, res) => {
  try {
    const { book_id } = req.body;

    // Check if book is available
    const { data: book } = await supabase
      .from('books')
      .select('available')
      .eq('id', book_id)
      .single();

    if (!book || book.available < 1) {
      return res.status(400).json({ error: 'Book not available' });
    }

    // Check if user already has this book borrowed
    const { data: existing } = await supabase
      .from('borrowed_books')
      .select('borrow_id')
      .eq('book_id', book_id)
      .eq('user_id', req.userId)
      .eq('is_borrowed', true)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'You already have this book borrowed' });
    }

    // Create borrow record
    const { data, error } = await supabase
      .from('borrowed_books')
      .insert({
        book_id,
        user_id: req.userId,
        return_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single();

    if (error) throw error;

    // Decrease available count
    await supabase
      .from('books')
      .update({ available: book.available - 1 })
      .eq('id', book_id);

    res.status(201).json({ message: 'Book borrowed successfully', borrow: data });
  } catch (error) {
    console.error('Borrow error:', error);
    res.status(500).json({ error: 'Failed to borrow book' });
  }
});

// Get user's borrowed books
router.get('/my-borrows', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('borrowed_books')
      .select(`
        *,
        books (id, title, author, cover_image_url)
      `)
      .eq('user_id', req.userId)
      .eq('is_borrowed', true);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowed books' });
  }
});

// Return a book
router.post('/return', authenticate, async (req, res) => {
  try {
    const { borrow_id } = req.body;

    // Get borrow record
    const { data: borrow } = await supabase
      .from('borrowed_books')
      .select('*, books(*)')
      .eq('borrow_id', borrow_id)
      .eq('user_id', req.userId)
      .single();

    if (!borrow) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    // Update borrow record
    const { error: updateError } = await supabase
      .from('borrowed_books')
      .update({ is_borrowed: false })
      .eq('borrow_id', borrow_id);

    if (updateError) throw updateError;

    // Add to returned_books
    await supabase
      .from('returned_books')
      .insert({
        book_id: borrow.book_id,
        user_id: req.userId,
        title: borrow.books?.title,
        author: borrow.books?.author,
        borrow_date: borrow.borrow_date
      });

    // Increase available count
    if (borrow.books) {
      await supabase
        .from('books')
        .update({ available: borrow.books.available + 1 })
        .eq('id', borrow.book_id);
    }

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Return error:', error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// Get all borrowed books (admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data, error } = await supabase
      .from('borrowed_books')
      .select(`
        *,
        users (user_id, username, email),
        books (id, title, author)
      `)
      .eq('is_borrowed', true);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowed books' });
  }
});

module.exports = router;