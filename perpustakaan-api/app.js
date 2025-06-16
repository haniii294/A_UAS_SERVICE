const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// --- PENAMBAHAN BARU ---
const passport = require('passport');
const session = require('express-session');
// --- AKHIR PENAMBAHAN ---

const rateLimit = require('express-rate-limit');
const cors = require('cors');

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
// --- PENAMBAHAN BARU ---
const authRoutes = require('./routes/auth'); // File baru yang akan kita buat
// --- AKHIR PENAMBAHAN ---

const app = express();
app.use(cors());
app.use(express.json());

const movementRoutes = require("./routes/movements");
app.use('/api/movements', movementRoutes);

// Koneksi MongoDB (sudah benar, tidak ada perubahan)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected (Atlas)");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

// --- PENAMBAHAN BARU: SESSION & PASSPORT MIDDLEWARE ---
// WAJIB ditaruh SEBELUM bagian Routes
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Inisialisasi Passport (juga sebelum routes)
app.use(passport.initialize());
app.use(passport.session());

// Menjalankan file konfigurasi passport kita (dari langkah sebelumnya)
require('./config/passport');
// --- AKHIR PENAMBAHAN ---


// Global Rate Limiter (sudah benar, tidak ada perubahan)
const globalLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 10 detik.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Khusus untuk login/register (sudah benar, tidak ada perubahan)
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

// --- PENAMBAHAN BARU: ROUTE OTENTIKASI ---
app.use('/api/auth', authLimiter, authRoutes);
// --- AKHIR PENAMBAHAN ---


module.exports = app;