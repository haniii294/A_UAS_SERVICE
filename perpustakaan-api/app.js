const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected (Atlas)");
})
.catch((err) => {
  console.error("MongoDB Connection Error:", err.message);
});

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

module.exports = app;
