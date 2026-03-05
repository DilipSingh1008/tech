const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const mediaPostController = require("../controllers/mediaPostController");

router.post("/", upload.single("image"), mediaPostController.createMediaPost);

router.get("/", mediaPostController.getMediaPosts);

router.get("/:id", mediaPostController.getMediaPost);

router.put("/:id", upload.single("image"), mediaPostController.updateMediaPost);

router.delete("/:id", mediaPostController.deleteMediaPost);

router.patch("/toggle-status/:id", mediaPostController.toggleStatus);

module.exports = router;
