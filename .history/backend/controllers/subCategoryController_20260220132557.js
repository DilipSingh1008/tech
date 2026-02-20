const express = require("express");
const router = express.Router();
const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");

router.post("/", createSubCategory);
router.get("/", getSubCategories);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;
