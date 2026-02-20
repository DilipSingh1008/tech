const {createCountryLocation, editCountryName, deleteCountry, getCountries} =  require("../controllers/countryLocation")

const express = require("express");

const router = express.Router();

router.get("/", getCountries)
router.post("/", createCountryLocation);
router.post("/:id/edit-country", editCountryName)
router.delete("/:id/delete-country", deleteCountry)

module.exports = router