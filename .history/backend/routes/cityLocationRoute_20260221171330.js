const {} =  require("../controllers/countryLocation")

const express = require("express");
const { getStates, createStateLocation, editStateName, deleteStates, getStatesByCountryId } = require("../controllers/stateLocation");
const { createCityLocation, editCityName, deletecity } = require("../controllers/cityLocation");

const router = express.Router();

 router.get("/:stateId", getStatesByCountryId)
router.post("/:stateId", createCityLocation);
router.put("/:cityId/edit-city", editCityName);
router.delete("/:cityId/delete-city", deletecity)

 router.post("/:id/edit-city", editStateName)
 router.delete("/:id/delete-city", deleteStates)

module.exports = router