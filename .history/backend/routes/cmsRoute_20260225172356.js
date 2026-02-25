const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload"); //  tumhara multer
const { createCMS, getAllCMS, getSingleCMS, updateCMS } = require("../controllers/cmsController");

//  create CMS
router.post("/create", upload.array("images", 5), createCMS);
router.get("/", getAllCMS);
router.get("/:id", getSingleCMS);
router.put("/update/:id", upload.array("images", 5), updateCMS);
router.patch("/toggle/:id", toggleCMSStatus);

module.exports = router;