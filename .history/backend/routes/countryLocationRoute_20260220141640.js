const {createCountryLocation, editCountryName, deleteCountry} =  require("../controllers/countryLocation")

const express = require("express");

const router = express.Router();


router.post("/", createCountryLocation);
router.post("/:id/edit-country", editCountryName)
router.delete("/:id/delete-country", deleteCountry)

module.exports = router