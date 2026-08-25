const mongoose = require('mongoose');

const resetCodeSchema = new mongoose.Schema({
  // The email this code belongs to
  email: {
    type: String,
    required: true,
  },

  // The 6-digit code
  code: {
    type: String,
    required: true,
  },

  // User's name (for the email greeting)
  userName: {
    type: String,
    required: true,
  },

  // When this code expires - MongoDB TTL index auto-deletes after 15 minutes
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    index: { expires: 0 }, // TTL index - MongoDB auto-deletes expired documents
  },
});

module.exports = mongoose.model('ResetCode', resetCodeSchema);