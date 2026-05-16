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

// Create order (checkout)
router.post('/', authenticate, [
  body('name').notEmpty().trim(),
  body('email').isEmail(),
  body('address').notEmpty().trim(),
  body('items').isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, address, items } = req.body;

    // Calculate total price from items
    const bookIds = items.map(item => item.book_id);
    const { data: books } = await supabase
      .from('books')
      .select('id, price')
      .in('id', bookIds);

    let totalPrice = 0;
    const orderItems = items.map(item => {
      const book = books.find(b => b.id === item.book_id);
      const price = book?.price || 0;
      totalPrice += price * item.quantity;
      return { book_id: item.book_id, quantity: item.quantity };
    });

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.userId,
        name,
        email,
        address,
        total_price: totalPrice
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.order_id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) throw itemsError;

    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          books (id, title, author, cover_image_url, price)
        )
      `)
      .eq('user_id', req.userId)
      .order('order_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          books (id, title, author, cover_image_url, price)
        )
      `)
      .eq('order_id', id)
      .eq('user_id', req.userId)
      .single();

    if (error) return res.status(404).json({ error: 'Order not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (user_id, username, email),
        order_items (
          *,
          books (id, title, author)
        )
      `)
      .order('order_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', id);

    if (error) throw error;
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;