const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResetCode = require('../models/ResetCode');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// POST /api/auth/verify-email
// Checks if email exists and generates a reset code stored in MongoDB
router.post('/verify-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing codes for this email first
    await ResetCode.deleteMany({ email });

    // Save the new code to MongoDB (auto-expires in 15 minutes via TTL index)
    await ResetCode.create({
      email,
      code: resetCode,
      userName: user.name,
    });

    // Send code back to frontend so EmailJS can send it to the user
    res.json({
      resetCode,
      userName: user.name,
      message: 'Verification successful'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/reset-password
// Verifies the code from MongoDB and updates the password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Look up the reset code in MongoDB
    const stored = await ResetCode.findOne({ email });

    if (!stored) {
      return res.status(400).json({ message: 'No reset code found. Please request a new one.' });
    }

    // Check if code matches
    if (stored.code !== code) {
      return res.status(400).json({ message: 'Invalid reset code. Please check your email.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in MongoDB
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete the used reset code
    await ResetCode.deleteMany({ email });

    res.json({ message: 'Password reset successfully! You can now log in.' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

module.exports = router;