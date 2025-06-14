const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const rateLimit = require('express-rate-limit');
const cors = require('cors');

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');

const app = express();
app.use(cors());
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

const globalLimiter = rateLimit({
    windowMs: 10 * 1000, 
    max: 5, 
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.', 
    standardHeaders: true,
    legacyHeaders: false, 
});
app.use(globalLimiter);

const authLimiter = rateLimit({
    windowMs: 10 * 1000, 
    max: 3, 
    message: 'Terlalu banyak percobaan login/register gagal dari IP ini, silakan coba lagi setelah 5 menit.', // Pesan error
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/books', bookRoutes);
app.use('/api/users', authLimiter , userRoutes);
app.use('/api/loans', loanRoutes);

module.exports = app;
