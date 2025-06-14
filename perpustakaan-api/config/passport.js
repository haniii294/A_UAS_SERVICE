// config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.js');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Data user baru yang akan disimpan, SESUAIKAN DENGAN SKEMA BARU
      const userData = {
        googleId: profile.id,
        name: profile.displayName, // 'name' di skema akan diisi oleh 'displayName' dari Google
        email: profile.emails[0].value,
        
        // Buat username dari email untuk memenuhi syarat 'required: true' di model
        username: profile.emails[0].value.split('@')[0]
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email: userData.email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Saat User.create dipanggil, 'userData' sudah lengkap termasuk 'username'
        user = await User.create(userData);
        //console.log('New user created:', user);
        return done(null, user);

      } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, null);
      }
    }
  )
);

// Bagian serialize & deserialize tidak perlu diubah
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});