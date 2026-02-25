const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/", upload.single("image"), createUser);
router.get("/", getUsers);
router.put("/:id", upload.single("image"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
