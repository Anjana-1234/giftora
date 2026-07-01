// Import express to create our web server
const express = require('express');

// Import cors so our React app (different port) can talk to this server
const cors = require('cors');

// Import mongoose to connect and talk to MongoDB
const mongoose = require('mongoose');

// Import dotenv to load secret values from .env file
require('dotenv').config();

// Import our product routes
const productRoutes = require('./routes/productRoutes');

//Import our order routes
const orderRoutes = require('./routes/orderRoutes');

// Import our stripe
const stripeRoutes = require('./routes/stripeRoutes');

// Import our auth routes
const authRoutes = require('./routes/authRoutes');

// Import our admin routes 
const adminRoutes = require('./routes/adminRoutes');

// Create the express app
const app = express();

// Middleware - lets our server accept JSON data in requests
app.use(express.json());

// Middleware - allows requests from our React app
app.use(cors());

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
  });

// Tell express to use our product routes for any URL starting with /api/products
app.use('/api/products', productRoutes);

//Tell express to use our order routes for any URL starting with /api/orders
app.use('/api/orders', orderRoutes);

//Tell express to use our striperoutes for any URL starting with /api/stripe
app.use('/api/stripe', stripeRoutes);

//Tell expressto use our auth routes for any URL starting with /api/auth
app.use('/api/auth', authRoutes);

// Tell express to use our admin routes for any URL starting with /api/admin
app.use('/api/admin', adminRoutes);

// A simple test route - visiting this in browser confirms server works
app.get('/', (req, res) => {
  res.send('Valentine\'s Flowers API is running');
});

// Set the port - use 5000 unless something else is specified in .env
const PORT = process.env.PORT || 5000;

// Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});