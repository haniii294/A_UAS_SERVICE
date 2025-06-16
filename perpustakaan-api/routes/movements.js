const express = require('express');
const router = express.Router();
const Movement = require('../models/movement');

// CREATE movement
router.post("/", async (req, res) => {
  try {
    const movement = new Movement(req.body);
    await movement.save();
    res.status(201).json(movement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all movements
router.get("/", async (req, res) => {
  try {
    const movements = await Movement.find().populate('bookId', 'title'); 
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET movement by ID
router.get("/:id", async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id).populate('bookId', 'title'); 
    if (!movement) return res.status(404).json({ message: "Not found" });
    res.json(movement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE movement by ID
router.delete("/:id", async (req, res) => {
  try {
    await Movement.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
