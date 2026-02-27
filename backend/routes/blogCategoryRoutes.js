const express = require("express");
const router = express.Router();
const {
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
  toggleBlogCategoryStatus,
} = require("../controllers/blogCategoryController.js");
router.post("/", createBlogCategory);
router.get("/", getBlogCategories);
router.put("/:id", updateBlogCategory);
router.delete("/:id", deleteBlogCategory);
router.patch("/toggle-status/:id", toggleBlogCategoryStatus);

module.exports = router;
