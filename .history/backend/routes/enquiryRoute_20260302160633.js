const express = require("express");
const router = express.Router();

const { createEnquiry, getEnquiries } = require("../controllers/enquiryController");


router.post("/", createEnquiry);
router.get("/", getEnquiries)

module.exports = router;