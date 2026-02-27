const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.js");

const {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews,
  toggleNewsStatus,
} = require("../controllers/newsController.js");

router.post("/", upload.array("images"), createNews);
router.get("/", getNews);
router.get("/:id", getNewsById);
router.put("/:id", upload.array("images"), updateNews);
router.delete("/:id", deleteNews);
router.patch("/status/:id", toggleNewsStatus);

module.exports = router;
