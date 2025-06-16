const express = require('express');
const router = express.Router();
const Loan = require('../models/loan');

const { loanLimiter } = require('../middleware/ratelimiters');

router.use(loanLimiter);
// CREATE loan
router.post('/', async (req, res) => {
  const loan = new Loan({
    ...req.body,
    borrowDate: new Date()
  });
  await loan.save();
  res.status(201).json(loan);
});

// READ all
router.get('/', async (req, res) => {
  const loans = await Loan.find().populate('userId bookId');
  res.json(loans);
});

// UPDATE (returning)
router.put('/:id', async (req, res) => {
  const updated = await Loan.findByIdAndUpdate(req.params.id, {
    ...req.body,
    returnDate: new Date(),
    status: 'dikembalikan'
  }, { new: true });
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Loan.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
