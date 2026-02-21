const {} =  require("../controllers/countryLocation")

const express = require("express");
const { getStates, createStateLocation, editStateName, deleteStates, getStatesByCountryId } = require("../controllers/stateLocation");
const { getCityByStateId } = require("../controllers/cityLocation");

const router = express.Router();

router.get("/:countryId", getStatesByCountryId)
router.get("/:stateId/all-cities", getCityByStateId)
router.post("/:countryId", createStateLocation);
router.put("/:id/edit-state", editStateName)
router.delete("/:id/delete-state", deleteStates)

module.exports = router