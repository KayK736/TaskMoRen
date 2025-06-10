const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newContactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    const savedMessage = await newContactMessage.save();
    res.status(201).json({ message: 'Message sent successfully!', data: savedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all contact messages (for admin)
// @route   GET /api/admin/contact-messages
// @access  Private (Admin Only)
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 