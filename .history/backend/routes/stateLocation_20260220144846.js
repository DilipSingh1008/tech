const {} =  require("../controllers/countryLocation")

const express = require("express");
const { getStates, createStateLocation, editStateName, deleteStates } = require("../controllers/stateLocation");

const router = express.Router();

router.get("/:countryId", getStatesByCountryId)
router.post("/:countryId", createStateLocation);
router.post("/:id/edit-state", editStateName)
router.delete("/:id/delete-state", deleteStates)

module.exports = router