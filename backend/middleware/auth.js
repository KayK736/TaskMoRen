const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

module.exports = async function (req, res, next) {
  // Get token from header or query parameter
  let token;
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Fetch the user to check their isActive status
    const user = await User.findById(decoded.id || decoded.user.id); // Adjust based on your token payload

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.' });
    }

    req.user = user; // Assign the full user object to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 