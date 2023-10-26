const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "Authentication failed" });
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Authentication failed" });
    } else {
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        "gfbjhfuyhfefuie"
      );
      res.status(200).json({ token, name: user.username, id: user._id });
    }
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = router;
