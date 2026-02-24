const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  toggleCategoryStatus,
} = require("../controllers/productCategoryController.js");

const upload = require("../middlewares/upload.js");

// ⭐ multiple images
router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.put("/:id", upload.array("images"), updateProduct);
router.patch("/status/:id", toggleCategoryStatus);
router.delete("/:id", deleteProduct);

module.exports = router;