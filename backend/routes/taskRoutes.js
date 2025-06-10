const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const PDFDocument = require('pdfkit');
const auth = require('../middleware/auth'); // Import the auth middleware

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming tasks for the authenticated user (due within 3 days)
router.get('/upcoming', auth, async (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const upcomingTasks = await Task.find({
      user: req.user.id,
      dueDate: {
        $gte: today,
        $lte: threeDaysFromNow
      },
      status: { $ne: 'completed' }
    }).sort({ dueDate: 1 });

    res.json(upcomingTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single task for the authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task for the authenticated user
router.post('/', auth, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    status: req.body.status || 'pending',
    user: req.user.id // Assign the task to the authenticated user
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task for the authenticated user
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task for the authenticated user
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF for a task for the authenticated user
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=task-${task._id}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(25).text('Task Details', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text('Title:', { continued: true })
       .fontSize(14).text(` ${task.title}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Description:', { continued: true })
       .fontSize(14).text(` ${task.description}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Status:', { continued: true })
       .fontSize(14).text(` ${task.status}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Priority:', { continued: true })
       .fontSize(14).text(` ${task.priority}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Created At:', { continued: true })
       .fontSize(14).text(` ${new Date(task.createdAt).toLocaleString()}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Due Date:', { continued: true })
       .fontSize(14).text(` ${new Date(task.dueDate).toLocaleString()}`);

    // Finalize the PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;