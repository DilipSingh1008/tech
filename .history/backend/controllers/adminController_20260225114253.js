const Admin = require("../models/admin.js");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");


// ⭐ get profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.find().select("-password");

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ⭐ update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    let updateData = { fullName, phone };

    if (req.file) {
      updateData.photo = req.file.path;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ⭐ change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);

    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // ⭐ check existing
    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    // ⭐ create admin
    const admin = await Admin.create({
      fullName,
      email: email.toLowerCase(),
      password,
      phone,
      role: "Admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Login


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ⭐ find admin
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin)
      return res.status(400).json({ message: "Admin not found" });

    // ⭐ compare password (model method)
    const isMatch = await admin.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // ⭐ create token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};