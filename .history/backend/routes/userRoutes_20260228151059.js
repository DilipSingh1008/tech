const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission");

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// CREATE
router.post(
  "/",
  auth(),
  checkPermission("users", "add"),
  upload.single("image"),
  createUser
);

// GET
router.get(
  "/",
  auth(),
  checkPermission("users", "view"),
  getUsers
);

// UPDATE
router.put(
  "/:id",
  auth(),
  checkPermission("users", "edit"),
  upload.single("image"),
  updateUser
);

// DELETE
router.delete(
  "/:id",
  auth(),
  checkPermission("users", "delete"),
  deleteUser
);

module.exports = router;