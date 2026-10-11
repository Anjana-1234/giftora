// Import express to create a router
const express = require('express');
const router = express.Router();

// Import our Order model
const Order = require('../models/Order');

// Import auth middleware
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Import stock helpers
const { reserveStock, releaseStock } = require('../utils/stock');

// POST /api/orders
// Creates a new order - called for both cash and card checkouts.
// Guests can order; if a valid token is sent, the order is linked to that account.
// Stock is taken first: if any item is short, nothing is saved and we reply 409.
router.post('/', optionalAuth, async (req, res) => {
  try {
    // Never trust these two from the browser:
    // - user is taken from the verified token below
    // - status always starts as 'pending'
    const { user: _ignoredUser, status: _ignoredStatus, ...orderData } = req.body;

    // 1) Take the stock (atomic, all-or-nothing)
    const reservation = await reserveStock(orderData.items);

    if (!reservation.ok) {
      if (reservation.invalid) {
        return res.status(400).json({ message: 'Your cart has an invalid item. Please refresh and try again.' });
      }
      return res.status(409).json({
        message: 'Some items are no longer available in the quantity you chose.',
        problems: reservation.problems,
      });
    }

    // 2) Save the order. If saving fails, give the stock back.
    try {
      const newOrder = new Order({
        ...orderData,
        user: req.user ? req.user.userId : null,
      });

      const savedOrder = await newOrder.save();
      return res.status(201).json(savedOrder);
    } catch (saveError) {
      await releaseStock(reservation.taken);
      throw saveError;
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// GET /api/orders/my
// Returns the logged-in user's orders, newest first.
// Must be defined BEFORE '/:id', otherwise "my" would be read as an order id.
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your orders', error: error.message });
  }
});

// GET /api/orders/:id
// Fetches a single order - used by the order confirmation page.
// Orders that belong to an account can only be read by that account or an admin.
// Guest orders (no user) stay viewable by id, since guests have no login to prove ownership.
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user) {
      const isOwner = req.user && String(order.user) === String(req.user.userId);
      const isAdmin = req.user && req.user.isAdmin;

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'You do not have access to this order.' });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Export this router so server.js can use it
module.exports = router;
