const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload"); //  tumhara multer
const { createCMS, getAllCMS, getSingleCMS } = require("../controllers/cmsController");

//  create CMS
router.post("/create", upload.array("images", 5), createCMS);
router.get("/", getAllCMS);
router.get("/:id", getSingleCMS);

module.exports = router;