const Admin = require("../models/admin.js");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
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

    const admin = await Admin.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ change password
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);

    // const isMatch = await admin.comparePassword(currentPassword);

    // if (!isMatch)
    //   return res.status(400).json({ message: "Current password incorrect" });

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

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // console.log(email);
//     // console.log(password);

//     // ⭐ find admin
//     // const admin = await Admin.findOne({
//     //   email: email.toLowerCase(),
//     // });
//     let account = await Admin.findOne({ email: email.toLowerCase() });

//     let roleType = "admin";

//     // if (!admin) return res.status(400).json({ message: "Admin not found" });

//     if (!account) {
//       account = await User.findOne({
//         email: email.toLowerCase(),
//         role: "sub-admin",
//       });
//       roleType = "sub-admin";
//     }

//     if (!account) {
//       return res.status(400).json({ message: "Account not found" });
//     }

//     // ⭐ compare password (model method)
//     let isMatch = false;

//     if (roleType === "admin") {
//       isMatch = await account.comparePassword(password);
//     } else if (roleType === "sub-admin") {
//       isMatch = await bcrypt.compare(password, account.password);
//     }

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     // ⭐ create token
//     // const token = jwt.sign(
//     //   {
//     //     id: admin._id,
//     //     role: admin.role,
//     //   },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: "1d" },
//     // );
//     const token = jwt.sign(
//       {
//         id: account._id,
//         role: roleType,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" },
//     );

//     console.log("LOGIN SECRET:", process.env.JWT_SECRET);

//     console.log("LOGIN SECRET:", process.env.JWT_SECRET);

//     // res.json({
//     //   token,
//     //   admin: {
//     //     id: admin._id,
//     //     fullName: admin.fullName,
//     //     email: admin.email,
//     //     role: admin.role,
//     //   },
//     // });
//     res.json({
//       token,
//       user: {
//         id: account._id,
//         fullName: account.fullName || account.name,
//         email: account.email,
//         role: roleType,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let account = await Admin.findOne({ email: email.toLowerCase() });
    let roleType = "admin";

    if (!account) {
      account = await User.findOne({
        email: email.toLowerCase(),
        status: true,
      }).populate("role", "name");
      roleType = account ? account.role.name : null;
    }

    if (!account) {
      return res.status(400).json({ message: "Account not found" });
    }

     // ⭐ last login update
    account.lastLogin = new Date();
    await account.save();

    const allowedRoles = ["sub-admin", "admin", "super-admin"];
    if (!allowedRoles.includes(roleType)) {
      return res.status(403).json({ message: "Access denied for your role" });
    }

    let isMatch = account.comparePassword
      ? await account.comparePassword(password)
      : await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: roleType,
        fullName: account.fullName || account.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: account._id,
        fullName: account.fullName || account.name,
        email: account.email,
        role: roleType,
        image: account.image || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
