const mongoose = require("mongoose");

const mediaCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MediaCategory", mediaCategorySchema);
