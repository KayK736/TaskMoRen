const express = require('express');
const { submitContactMessage, getAllContactMessages } = require('../controllers/contactController');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Public route for submitting contact messages
router.post('/', submitContactMessage);

// Private admin route for getting all contact messages
router.get('/admin', adminAuth, getAllContactMessages);

module.exports = router; 