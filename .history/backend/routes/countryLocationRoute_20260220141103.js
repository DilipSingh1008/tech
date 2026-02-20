const {createCountryLocation, editCountryName} =  require("../controllers/countryLocation")

const express = require("express");

const router = express.Router();


router.post("/", createCountryLocation);
router.post("/:id/edit-country", editCountryName)

module.exports = router