const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: false,
  },
  movement: {
    type: Boolean,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Movement", movementSchema);
