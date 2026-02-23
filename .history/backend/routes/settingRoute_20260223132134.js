const express = require("express");
const router = express.Router();
const controller = require("../controllers/settingController");
const { upload } = require("../middleware/upload");

router.get("/site", controller.getSiteSetting);
router.put("/site", upload, controller.updateSiteSetting);

module.exports = router;