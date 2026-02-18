const express = require("express");
const router = express.Router();
const { createQuote, getQuotes } = require("../controllers/quoteController");
const auth = require("../middlewares/auth");

// Client submits quote
router.post("/", createQuote);

// Admin views quotes
router.get("/", auth(["admin"]), getQuotes);

module.exports = router;
