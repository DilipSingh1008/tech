const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} = require("../controllers/productItemController.js");

const upload = require("../middlewares/upload.js");

//  CREATE
router.post("/", upload.array("images", 5), createProduct);

//  GET ALL
router.get("/", getProducts);

//  GET SINGLE
router.get("/:id", getProductById);

//  UPDATE
router.put("/:id", upload.array("images", 5), updateProduct);

//  DELETE
router.delete("/:id", deleteProduct);

//  STATUS TOGGLE
router.patch("/status/:id", toggleProductStatus);

module.exports = router;