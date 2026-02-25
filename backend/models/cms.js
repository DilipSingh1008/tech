const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    meta: {
      type: String,
      trim: true,
      default: "",
    },

    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    images: [
      {
        type: String, // ⭐ only url
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CMS", cmsSchema);