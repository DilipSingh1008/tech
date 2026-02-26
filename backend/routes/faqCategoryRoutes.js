const express = require("express");
const router = express.Router();

const {
  createFaqCategory,
  getFaqCategories,
  updateFaqCategory,
  deleteFaqCategory,
  toggleFaqStatus,
} = require("../controllers/faqCategoryController.js");

router.post("/", createFaqCategory);
router.get("/", getFaqCategories);
router.put("/:id", updateFaqCategory);
router.delete("/:id", deleteFaqCategory);
router.patch("/toggle-status/:id", toggleFaqStatus);

module.exports = router;
