const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Terhubung ke MongoDB");
}

module.exports = connectDB;
