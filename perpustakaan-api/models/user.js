// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: String,
  nim: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    // --- INI BAGIAN YANG DIUBAH ---
    // Password hanya wajib jika tidak ada googleId
    required: function() {
      // 'this' merujuk pada dokumen user yang sedang divalidasi
      // Jika this.googleId ada isinya (truthy), maka fungsi ini return false (tidak wajib)
      // Jika this.googleId kosong (falsy), maka fungsi ini return true (wajib)
      return !this.googleId;
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);