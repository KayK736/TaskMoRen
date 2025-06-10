const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Google OAuth login/signup
router.post('/google', authController.googleAuth);

module.exports = router; 