const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");


// ⭐ profile
router.get("/profile",  adminController.getProfile);

// ⭐ update profile
router.put(
  "/profile",
  auth,
  upload.single("photo"),
  adminController.updateProfile
);

// ⭐ change password
router.put("/change-password", auth, adminController.changePassword);

module.exports = router;