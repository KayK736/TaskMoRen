const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user (sends OTP)
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

// Google OAuth login/signup
router.post('/google', authController.googleAuth);

module.exports = router; 