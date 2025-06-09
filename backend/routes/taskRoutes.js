const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const PDFDocument = require('pdfkit');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming tasks (due within 3 days)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const upcomingTasks = await Task.find({
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

// Get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    status: req.body.status || 'pending'
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
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

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF for a task
router.get('/:id/pdf', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
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