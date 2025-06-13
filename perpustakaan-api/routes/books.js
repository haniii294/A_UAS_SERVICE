const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// CREATE
router.post('/', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

// READ all
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// READ one
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
