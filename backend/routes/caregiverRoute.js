const express = require("express");
const router = express.Router();
const Caregiver = require("../models/caregiver");
const { verifyToken } = require("../middleware");

// Add a new caregiver for a user
router.post("/caregivers", verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = req.userId;
    const caregiver = new Caregiver({ name, email, phone, user });
    await caregiver.save();
    res.status(201).json({ message: "Caregiver added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Caregiver addition failed" });
  }
});

// Get all caregivers
router.get("/allcaregivers", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const caregivers = await Caregiver.find({ user: userId });
    if (caregivers.length === 0) {
      return res
        .status(201)
        .json({ message: "No caregivers found for the user" });
    }

    res.status(200).json(caregivers);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a caregiver
router.put("/caregivers/:caregiverId", async (req, res) => {
  try {
    await Caregiver.findByIdAndUpdate(req.params.caregiverId, req.body);
    res.status(200).json({ message: "Caregiver updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Caregiver update failed" });
  }
});

// Delete a caregiver
router.delete("/caregivers/:caregiverId", async (req, res) => {
  try {
    await Caregiver.findByIdAndRemove(req.params.caregiverId);
    res.status(200).json({ message: "Caregiver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Caregiver deletion failed" });
  }
});

module.exports = router;
