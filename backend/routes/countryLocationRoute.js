const {createCountryLocation} =  require("../controllers/countryLocation")

const express = require("express");

const router = express.Router();


router.post("/", createCountryLocation);

module.exports = router