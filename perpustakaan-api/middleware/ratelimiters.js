const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message:
    'Terlalu banyak permintaan otentikasi dari IP ini, coba lagi setelah 1 menit',
  headers: true,
  statusCode: 429,
});

const bookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,
  message:
    'Terlalu banyak permintaan untuk endpoint buku ini, coba lagi setelah 1 menit',
  headers: true,
  statusCode: 429,
});

const loanLimiter = rateLimit({
  windowMs: 10 * 1000, 
  max: 5,
  message:
    'Terlalu banyak permintaan untuk endpoint peminjaman ini, coba lagi setelah 10 detik',
  headers: true,
  statusCode: 429,
});

const userProfileLimiter = rateLimit({
   windowMs: 1 * 60 * 1000,
   max: 5, 
   message: 'Terlalu banyak permintaan untuk profil pengguna.',
   headers: true,
   statusCode: 429,
 });


module.exports = {
  authLimiter,
  bookLimiter,
  loanLimiter,
  userProfileLimiter,
};
