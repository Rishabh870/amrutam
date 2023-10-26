const express = require("express");
const router = express.Router();
const MedicationReminder = require("../models/medicationRemonder");
const { verifyToken } = require("../middleware");

console.log();
// Create a new medication reminder
router.post("/reminders", verifyToken, async (req, res) => {
  try {
    const user = req.userId;
    const { name, dosage, frequency, time, caregiver } = req.body;
    const reminder = new MedicationReminder({
      name,
      dosage,
      frequency,
      time,
      user,
      caregiver,
    });
    await reminder.save();
    res
      .status(201)
      .json({ message: "Medication reminder created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a medication reminder by Id
router.get("/reminder/:reminderId", async (req, res) => {
  try {
    const reminder = await MedicationReminder.findById(
      req.params.reminderId
    ).populate("caregiver");
    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Update a medication reminder
router.put("/reminders/:reminderId", async (req, res) => {
  try {
    await MedicationReminder.findByIdAndUpdate(req.params.reminderId, req.body);
    res
      .status(200)
      .json({ message: "Medication reminder updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete a medication reminder
router.delete("/reminders/:reminderId", async (req, res) => {
  try {
    await MedicationReminder.findByIdAndRemove(req.params.reminderId);
    res
      .status(200)
      .json({ message: "Medication reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed" });
  }
});

// Retrieve all medication reminders for a user
router.get("/allreminders", verifyToken, async (req, res) => {
  try {
    const reminders = await MedicationReminder.find({
      user: req.userId,
    }).populate("caregiver");

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
