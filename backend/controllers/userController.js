const User = require("../models/User");
const fs = require("fs");
const path = require("path");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";
    console.log("image", imagePath);
    const user = await User.create({
      name,
      email,
      password,
      role: roleId,
      image: imagePath,
      status: true,
    });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .populate("role", "name")
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 });

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

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

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
