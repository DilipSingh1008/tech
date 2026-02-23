const express = require("express");
const router = express.Router();
const controller = require("../controllers/siteSettingController.js");
const { upload } = require("../middlewares/upload.js");

router.get("/site", controller.getSiteSetting);
router.put("/site", upload, controller.updateSiteSetting);

module.exports = router;