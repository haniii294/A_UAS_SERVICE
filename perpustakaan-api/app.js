const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const passport = require('passport');
const session = require('express-session');

const rateLimit = require('express-rate-limit');
const cors = require('cors');

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const authRoutes = require('./routes/auth'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected (Atlas)");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


require('./config/passport');

const globalLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 10 detik.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 3,
  message: 'Terlalu banyak percobaan login/register gagal dari IP ini, silakan coba lagi setelah 10 detik.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/auth', authLimiter, authRoutes);


module.exports = app;