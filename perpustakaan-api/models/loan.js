const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  borrowDate: Date,
  returnDate: Date,
  status: { type: String, enum: ['dipinjam', 'dikembalikan'], default: 'dipinjam' }
});

module.exports = mongoose.model('Loan', loanSchema);
