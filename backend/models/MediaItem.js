const mongoose = require("mongoose");

const mediaItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String }, // image/video path
    url: { type: String, default: "" },
    link: { type: String, default: "" },
    category: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], default: "image" },
    status: { type: Boolean, default: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MediaItem", mediaItemSchema);
