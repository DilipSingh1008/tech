const Quote = require("../models/Quote");

exports.createQuote = async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json({ message: "Quote submitted", quote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
