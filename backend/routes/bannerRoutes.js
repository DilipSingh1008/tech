const express = require("express");
const router = express.Router();
const upload = require("../middlewares/bannerUpload");
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.post("/", upload.single("image"), createBanner);
router.get("/", getBanners);
router.put("/:id", upload.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
