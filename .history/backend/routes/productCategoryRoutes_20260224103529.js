const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} = require("../controllers/productCategoryController.js");


//  multer upload middleware (agar image upload kar rahe ho)
const upload = require("../middlewares/upload.js");


//  CREATE
router.post("/", upload.single("image"), createCategory);

//  GET ALL
router.get("/", getCategories);

//  GET SINGLE
router.get("/:id", getCategoryById);

//  UPDATE
router.put("/:id", upload.single("image"), updateCategory);

//  DELETE
router.delete("/:id", deleteCategory);

//  STATUS TOGGLE
router.patch("/status/:id", toggleCategoryStatus);

module.exports = router;