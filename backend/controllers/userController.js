const User = require("../models/User");
const fs = require("fs");

// ✅ CREATE USER (Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const imagePath = req.file ? `/uploads/User/${req.file.filename}` : "";

    const user = new User({
      name,
      email,
      password,
      role,
      image: imagePath,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET USERS (Pagination + Search)
exports.getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: users,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update image
    if (req.file) {
      if (user.image && fs.existsSync("." + user.image)) {
        fs.unlinkSync("." + user.image);
      }
      user.image = `/uploads/User/${req.file.filename}`;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    if (status !== undefined) user.status = status;

    await user.save();

    res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.image && fs.existsSync("." + user.image)) {
      fs.unlinkSync("." + user.image);
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
