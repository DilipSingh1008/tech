const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const upload = require("../middlewares/upload");
router.post("/", upload.single("icon"), createCategory);
router.put("/:id", upload.single("icon"), updateCategory);
// router.post('/', createCategory);
router.get("/", getCategories);
// router.put('/:id', updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
