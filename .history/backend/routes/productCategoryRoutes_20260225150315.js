const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteCategory,
  toggleCategoryStatus,
  getProdutsById,
} = require("../controllers/productCategoryController.js");

const upload = require("../middlewares/upload.js");

// ⭐ multiple images
router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProdutsById);

router.put("/:id", upload.array("images"), updateProduct);
router.patch("/status/:id", toggleCategoryStatus);
router.delete("/:id", deleteCategory);

module.exports = router;