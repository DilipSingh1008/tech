const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  getActiveCategories,
} = require("../controllers/blogController");

router.post("/", upload.array("images"), createBlog);
router.get("/active", getActiveCategories);

router.get("/", getBlogs);

router.get("/:id", getBlogById);

router.put("/:id", upload.array("images"), updateBlog);

router.delete("/:id", deleteBlog);

router.patch("/status/:id", toggleBlogStatus);

module.exports = router;
