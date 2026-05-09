const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Get all members for task assignment
router.get('/members', async (req, res) => {
  try {
    // Finds users where role is 'Member', returning only _id, name, and email
    const members = await User.find({ role: 'Member' }).select('name email');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Note: select('+password') is only needed if you set select: false in your User Schema
  const user = await User.findOne({ email }); 
  
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role, name: user.name });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;