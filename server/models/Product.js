const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ['flower', 'gift'],
    required: true,
  },

  color: {
    type: String,
    default: null,
  },

  // Short description shown in the popup modal when user clicks on item
  description: {
    type: String,
    default: '',
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);