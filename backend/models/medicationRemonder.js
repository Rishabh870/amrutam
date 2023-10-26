const mongoose = require("mongoose");

const medicationReminderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: Date, required: true },
  frequency: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caregiver: { type: mongoose.Schema.Types.ObjectId, ref: "Caregiver" },
});

module.exports = mongoose.model("MedicationReminder", medicationReminderSchema);
