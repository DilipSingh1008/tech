const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
 
} = require("../controllers/product.controller");

const upload = require("../middlewares/upload.js");

// ⭐ multiple images
router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.put("/:id", upload.array("images"), updateProduct);
// router.patch("/:id", patchProduct);
// router.delete("/:id", deleteProduct);

module.exports = router;