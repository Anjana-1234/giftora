const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// All routes protected - must be logged in AND admin
router.use(protect);
router.use(adminOnly);

// ─── ORDERS ───────────────────────────────────────────────

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
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
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// POST /api/admin/products
// Creates a new product
router.post('/products', async (req, res) => {
  try {
    const { name, price, image, category, color, description, availableQuantity } = req.body;

    const newProduct = new Product({
      name,
      price: Number(price),
      image,
      category,
      color: color || null,
      description: description || '',
      availableQuantity: Number(availableQuantity) || 100,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// PUT /api/admin/products/:id
// Updates an existing product
router.put('/products/:id', async (req, res) => {
  try {
    const { name, price, image, category, color, description, availableQuantity } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        image,
        category,
        color: color || null,
        description: description || '',
        availableQuantity: Number(availableQuantity),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/admin/products/:id
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
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// PATCH /api/admin/users/:id/toggle-admin
// Flips a user's isAdmin flag -- how an admin grants or revokes admin
// access for someone else. No separate admin signup exists on purpose.
router.patch('/users/:id/toggle-admin', async (req, res) => {
  try {
    // Don't let an admin accidentally strip their own access.
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ message: "You can't change your own admin status." });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    targetUser.isAdmin = !targetUser.isAdmin;
    await targetUser.save();

    const { password, ...safeUser } = targetUser.toObject();
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// ─── STATS ────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
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