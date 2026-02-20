const {country} =  require("../controllers/countryLocation")

const express = require("express");

const router = express.Router();


router.post("/", createC);