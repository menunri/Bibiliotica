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

// Analytics data for charts
router.get('/analytics', authenticate, isAdmin, async (req, res) => {
  try {
    // Get borrow trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: borrowTrends } = await supabase
      .from('borrowed_books')
      .select('borrow_date')
      .gte('borrow_date', thirtyDaysAgo.toISOString())
      .order('borrow_date', { ascending: true });

    // Get return trends (last 30 days)
    const { data: returnTrends } = await supabase
      .from('returned_books')
      .select('return_date')
      .gte('return_date', thirtyDaysAgo.toISOString())
      .order('return_date', { ascending: true });

    // Get books by genre
    const { data: booksByGenre } = await supabase
      .from('books')
      .select('genre');

    // Get top borrowed books
    const { data: topBorrowedBooks } = await supabase
      .from('borrowed_books')
      .select('book_id, books(title, author)')
      .order('borrow_date', { ascending: false });

    // Get monthly activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const { data: monthlyBorrows } = await supabase
      .from('borrowed_books')
      .select('borrow_date')
      .gte('borrow_date', sixMonthsAgo.toISOString());

    const { data: monthlyReturns } = await supabase
      .from('returned_books')
      .select('return_date')
      .gte('return_date', sixMonthsAgo.toISOString());

    // Get recent activity
    const { data: recentBorrows } = await supabase
      .from('borrowed_books')
      .select('*, users(username), books(title, author)')
      .order('borrow_date', { ascending: false })
      .limit(5);

    const { data: recentReturns } = await supabase
      .from('returned_books')
      .select('*, users(username), books(title, author)')
      .order('return_date', { ascending: false })
      .limit(5);

    // Process borrow trends into daily counts
    const borrowDailyCounts = {};
    const returnDailyCounts = {};
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      borrowDailyCounts[dateStr] = 0;
      returnDailyCounts[dateStr] = 0;
    }

    borrowTrends?.forEach(b => {
      const dateStr = new Date(b.borrow_date).toISOString().split('T')[0];
      if (borrowDailyCounts[dateStr] !== undefined) {
        borrowDailyCounts[dateStr]++;
      }
    });

    returnTrends?.forEach(r => {
      const dateStr = new Date(r.return_date).toISOString().split('T')[0];
      if (returnDailyCounts[dateStr] !== undefined) {
        returnDailyCounts[dateStr]++;
      }
    });

    // Process genre distribution
    const genreCounts = {};
    booksByGenre?.forEach(b => {
      const genre = b.genre || 'Uncategorized';
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    // Process top borrowed books
    const bookBorrowCount = {};
    topBorrowedBooks?.forEach(b => {
      if (b.book_id) {
        bookBorrowCount[b.book_id] = (bookBorrowCount[b.book_id] || 0) + 1;
      }
    });

    // Get book details directly from books table
    const bookIds = Object.keys(bookBorrowCount).map(id => parseInt(id));
    let bookDetails = {};
    if (bookIds.length > 0) {
      const { data: booksData } = await supabase
        .from('books')
        .select('id, title, author')
        .in('id', bookIds);
      
      if (booksData) {
        booksData.forEach(book => {
          bookDetails[book.id] = book;
        });
      }
    }

    const topBooks = Object.entries(bookBorrowCount)
      .map(([bookId, count]) => {
        const bookInfo = bookDetails[parseInt(bookId)] || {};
        return {
          book_id: parseInt(bookId),
          title: bookInfo.title || 'Unknown',
          author: bookInfo.author || 'Unknown',
          borrow_count: count
        };
      })
      .sort((a, b) => b.borrow_count - a.borrow_count)
      .slice(0, 5);

    // Process monthly activity
    const monthlyData = {};
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[monthStr] = { borrows: 0, returns: 0 };
    }

    monthlyBorrows?.forEach(b => {
      const date = new Date(b.borrow_date);
      const monthStr = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyData[monthStr]) monthlyData[monthStr].borrows++;
    });

    monthlyReturns?.forEach(r => {
      const date = new Date(r.return_date);
      const monthStr = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyData[monthStr]) monthlyData[monthStr].returns++;
    });

    res.json({
      borrow_trends: Object.entries(borrowDailyCounts)
        .map(([date, count]) => ({ date, borrows: count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      return_trends: Object.entries(returnDailyCounts)
        .map(([date, count]) => ({ date, returns: count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      category_distribution: Object.entries(genreCounts).map(([name, value]) => ({ name, value })),
      top_books: topBooks,
      monthly_activity: Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .reverse(),
      recent_activity: [
        ...(recentBorrows?.map(b => ({
          type: 'borrow',
          user: b.users?.username || 'Unknown',
          book: b.books?.title || 'Unknown',
          author: b.books?.author || 'Unknown',
          date: b.borrow_date
        })) || []),
        ...(recentReturns?.map(r => ({
          type: 'return',
          user: r.users?.username || 'Unknown',
          book: r.books?.title || 'Unknown',
          author: r.books?.author || 'Unknown',
          date: r.return_date
        })) || [])
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;