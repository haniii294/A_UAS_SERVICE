const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/authController');

// REGISTER - SEKARANG MEMAKAI CONTROLLER YANG BENAR
router.post('/register', authController.register);

// LOGIN - SEKARANG MEMAKAI CONTROLLER YANG BENAR
router.post('/login', authController.login);

// READ all users - DITAMBAH .select('-password') AGAR AMAN
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ one user by ID - DITAMBAH .select('-password') AGAR AMAN
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;