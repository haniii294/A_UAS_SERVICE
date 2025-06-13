const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  category: String,
  stock: Number
});

module.exports = mongoose.model('Book', bookSchema);
