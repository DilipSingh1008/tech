const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    mainDescription: { type: String },
    images: [{ type: String }],
    publishedDate: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("NewsItem", newsSchema);
