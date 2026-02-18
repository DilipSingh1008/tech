const express = require("express");
const router = express.Router();
const User = require("../models/User");
const register = require("../controllers/authController");
// Admin Register (One-time)
console.log(register);
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const admin = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await admin.save();
    res.json({ message: "Admin user created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
