const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (name only)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;
    // Email cannot be updated via this route

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(400).json({ message: error.message });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.deleteOne(); // Use deleteOne() or remove() depending on Mongoose version
    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload user profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Construct the URL for the uploaded image
    // Assuming your server is running on localhost:5000 and static files are served from /uploads
    const imageUrl = `/uploads/${req.file.filename}`;
    user.profilePicture = imageUrl;
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully.', profilePicture: imageUrl });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => res.json(await User.find());
exports.updateUser = async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deactivateUser = async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }));
