const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");


// ⭐ AUTH ROUTES
router.post("/register", adminController.register);
router.post("/login", adminController.login);


// ⭐ PROFILE ROUTES
router.get("/profile", auth, adminController.getProfile);

router.put(
  "/profile",
  auth,
  upload.single("photo"),
  adminController.updateProfile
);

router.put("/change-password", auth, adminController.changePassword);

module.exports = router;