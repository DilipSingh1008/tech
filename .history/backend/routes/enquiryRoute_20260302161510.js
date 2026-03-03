const express = require("express");
const router = express.Router();

const { createEnquiry, getEnquiries, searchClientByMobile } = require("../controllers/enquiryController");


router.post("/", createEnquiry);
router.get("/", getEnquiries)
router.get("/search-mobile-number", searchClientByMobile);

module.exports = router;