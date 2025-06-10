const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth'); // Import the auth middleware

// Get all schedules for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id }).sort({ date: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single schedule for the authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, user: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new schedule for the authenticated user
router.post('/', auth, async (req, res) => {
  try {
    const scheduleData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      type: req.body.type || 'other',
      priority: req.body.priority || 'medium',
      user: req.user.id // Assign the schedule to the authenticated user
    };

    // Only add endTime if it's provided
    if (req.body.endTime) {
      scheduleData.endTime = req.body.endTime;
    }

    const schedule = new Schedule(scheduleData);
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a schedule for the authenticated user
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, user: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      type: req.body.type,
      priority: req.body.priority
    };

    // Only update endTime if it's provided
    if (req.body.endTime !== undefined) {
      updateData.endTime = req.body.endTime;
    }

    Object.assign(schedule, updateData);
    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a schedule for the authenticated user
router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, user: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 