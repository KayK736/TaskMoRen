const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assuming auth middleware is in ../middleware/auth.js
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Get authenticated user profile
router.get('/profile', auth, userController.getProfile);

// Update authenticated user profile (name only)
router.put('/profile', auth, userController.updateProfile);

// Change authenticated user password
router.put('/profile/password', auth, userController.changePassword);

// Upload authenticated user profile picture
router.post('/profile/picture', auth, upload.single('profilePicture'), userController.uploadProfilePicture);

// Delete authenticated user account
router.delete('/profile', auth, userController.deleteAccount);

// Admin only routes (if needed, keep existing or modify)
// Example: Get all users (needs admin role check in auth middleware or a separate admin middleware)
// router.get('/', auth, userController.getUsers); // Assuming getUsers is also moved to controller
// router.put('/:id', auth, userController.updateUser); // Assuming updateUser is also moved to controller

module.exports = router;