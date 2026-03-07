const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const {
  createCMS,
  getAllCMS,
  getSingleCMS,
  updateCMS,
  toggleCMSStatus,
  deleteCMS,
} = require("../controllers/cmsController");

router.post("/create", upload.array("images", 5), createCMS);
router.get("/", getAllCMS);
router.get("/:id", getSingleCMS);
router.delete("/:id", deleteCMS);
router.put("/update/:id", upload.array("images", 5), updateCMS);
router.patch("/toggle/:id", toggleCMSStatus);

module.exports = router;
