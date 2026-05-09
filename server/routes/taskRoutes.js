const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/tasks
// @desc    Create a new task (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks (Members see their own, Admins see all)
router.get('/', protect, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'Admin') {
      query = Task.find().populate('assignedTo', 'name email');
    } else {
      query = Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
    }
    const tasks = await query;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/tasks/:id
// @desc    Update task status
router.patch('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;