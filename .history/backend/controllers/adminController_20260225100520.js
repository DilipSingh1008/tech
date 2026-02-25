const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");


// ⭐ get profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

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