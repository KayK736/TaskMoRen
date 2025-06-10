const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Admin login
router.post('/login', adminController.login);

// Protected admin routes
router.get('/users', adminAuth, adminController.getAllUsers);
router.put('/users/:userId', adminAuth, adminController.updateUser);
router.get('/users/report', adminAuth, adminController.generateUserReport);

module.exports = router; 