const {createCountryLocation, editCountryName, deleteCountry, getCountries, toggleCountryStatus} =  require("../controllers/countryLocation")

const express = require("express");

const router = express.Router();

router.get("/", getCountries)
router.post("/", createCountryLocation);
router.put("/:id/edit-country", editCountryName)
router.delete("/:id/delete-country", deleteCountry)
router.patch("/:id/toggle-status", toggleCountryStatus);

module.exports = router