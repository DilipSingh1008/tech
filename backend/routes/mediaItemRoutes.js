const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const mediaItemController = require("../controllers/mediaItemController");

// CRUD routes
router.get("/", mediaItemController.getAllMediaItems);
router.get("/:id", mediaItemController.getMediaItem);
router.post("/", upload.single("icon"), mediaItemController.createMediaItem);
router.put("/:id", upload.single("icon"), mediaItemController.updateMediaItem);
router.delete("/:id", mediaItemController.deleteMediaItem);

module.exports = router;