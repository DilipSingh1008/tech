const mongoose = require("mongoose");

const mediaPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    month: {
      type: String,
      required: true,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    publishDate: { type: Date, required: true },
    image: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MediaPost", mediaPostSchema);
