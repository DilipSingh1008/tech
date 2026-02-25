const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload"); //  tumhara multer
const { createCMS } = require("../controllers/cmsController");

//  create CMS
router.post("/create", upload.array("images", 5), createCMS);

module.exports = router;