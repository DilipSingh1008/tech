const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  stack: { type: String, required: true },
});

module.exports = mongoose.model("Career", careerSchema, "Career");
