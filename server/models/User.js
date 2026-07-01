// Import mongoose to define our schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  // User's full name
  name: {
    type: String,
    required: true,
  },

  // Email - must be unique
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  // Hashed password - we NEVER store the plain text password
  password: {
    type: String,
    required: true,
  },

  // Whether this user has admin privileges
  // Regular signups get false by default - only manually set to true in DB
  isAdmin: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);