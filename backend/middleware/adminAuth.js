const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import the Admin model

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
    console.log('adminAuth: No token provided.'); // Debug log
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('adminAuth: Decoded token payload:', decoded); // Debug log

    // Fetch the admin to ensure the token corresponds to an existing admin
    // Note: Assuming decoded.id holds the admin's _id
    const admin = await Admin.findById(decoded.id); 
    console.log('adminAuth: Admin found by ID:', !!admin); // Debug log (true/false)

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.admin = admin; // Assign the full admin object to req.admin
    next();
  } catch (err) {
    console.error('adminAuth: Token verification error:', err.message); // Debug log
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
}; 