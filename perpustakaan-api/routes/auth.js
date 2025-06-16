const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const verifyToken = require('../middleware/auth.js');
const { authLimiter } = require('../middleware/ratelimiters');


router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  authLimiter,
  passport.authenticate('google', {
    failureRedirect: '/api/auth/login-failed',
    session: false,
  }),
  (req, res) => {
    // Buat payload untuk JWT
    const payload = {
      id: req.user.id,
      name: req.user.displayName,
      email: req.user.email,
    };

    // Buat token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Kirim token sebagai response ke client
    res.json({
      success: true,
      message: 'Authentication successful!',
      token: `Bearer ${token}`,
      user: payload,
    });
  }
);


router.get('/login-failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Google authentication failed.'
    });
});

router.get('/me', authLimiter, verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

module.exports = router;
