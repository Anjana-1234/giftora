// Import jwt to verify tokens
const jwt = require('jsonwebtoken');

// This middleware runs before protected routes
// It checks if the request has a valid JWT token
function protect(req, res, next) {
  try {
    // Get the token from the Authorization header
    // Format is: "Bearer eyJhbGc..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    // Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key
    // If it's invalid or expired, this will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request so the next function can use it
    req.user = decoded;

    // Move on to the actual route handler
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

// Middleware to check if the logged-in user is an admin
// Must be used AFTER the protect middleware
function adminOnly(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next(); // user is admin, allow through
  } else {
    res.status(403).json({ message: 'Admin access required.' });
  }
}

module.exports = { protect, adminOnly };