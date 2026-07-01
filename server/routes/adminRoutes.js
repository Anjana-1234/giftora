// Import express to create a router
const express = require('express');
const router = express.Router();

// Import our auth middleware to protect these routes
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Import all models we need
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// All routes below are protected - user must be logged in AND be an admin
// We apply both middleware to every route in this file
router.use(protect);
router.use(adminOnly);

// ─── ORDERS ───────────────────────────────────────────────

// GET /api/admin/orders
// Returns all orders, newest first
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// PUT /api/admin/orders/:id/status
// Updates the status of a specific order
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Find the order and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // returns the updated document, not the old one
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────

// GET /api/admin/products
// Returns all products (flowers + gifts)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// DELETE /api/admin/products/:id
// Deletes a product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// ─── USERS ────────────────────────────────────────────────

// GET /api/admin/users
// Returns all registered users (without their passwords)
router.get('/users', async (req, res) => {
  try {
    // .select('-password') tells mongoose to exclude the password field
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// ─── DASHBOARD STATS ──────────────────────────────────────

// GET /api/admin/stats
// Returns quick summary numbers for the dashboard overview
router.get('/stats', async (req, res) => {
  try {
    // Run all counts at the same time using Promise.all for efficiency
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalUsers,
      totalProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'delivered' }),
      User.countDocuments(),
      Product.countDocuments(),
    ]);

    // Calculate total revenue from all paid orders
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

module.exports = router;