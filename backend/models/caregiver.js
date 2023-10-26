const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Caregiver", caregiverSchema);
