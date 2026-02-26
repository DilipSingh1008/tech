const mongoose = require("mongoose");

const manageFaqSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ManageFaq", manageFaqSchema);
