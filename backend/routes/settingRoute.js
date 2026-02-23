const express = require("express");
const router = express.Router();
const controller = require("../controllers/siteSettingController.js");
const  upload  = require("../middlewares/upload.js");

router.get("/site", controller.getSiteSetting);
router.put(
  "/site",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  controller.updateSiteSetting
);

module.exports = router; 