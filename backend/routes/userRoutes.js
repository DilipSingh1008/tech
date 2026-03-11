const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission");
const authController = require("../controllers/adminController");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserPermissions,
  updateUserPermissions,
} = require("../controllers/userController");

// CREATE
router.post(
  "/",
  auth(),
  checkPermission("users", "add"),
  upload.single("image"),
  createUser,
);

// GET
router.get("/", auth(), checkPermission("users", "view"), getUsers);

// UPDATE
router.put(
  "/:id",
  auth(),
  checkPermission("users", "edit"),
  upload.single("image"),
  updateUser,
);

// DELETE
router.delete("/:id", auth(), checkPermission("users", "delete"), deleteUser);
router.post("/logout", authController.logout);

router.get(
  "/:id/permissions",
  auth(),
  checkPermission("users", "view"),
  getUserPermissions
);

router.put(
  "/:id/permissions",
  auth(),
  checkPermission("users", "edit"),
  updateUserPermissions
);

module.exports = router;
