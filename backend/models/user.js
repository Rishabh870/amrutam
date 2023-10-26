const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // You should hash the password
  phone: String,
});

module.exports = mongoose.model("User", userSchema);
