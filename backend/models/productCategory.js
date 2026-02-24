const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      default: "Category",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    mainDescription: {
      type: String, // HTML from Quill
      default: "",
    },

    images: [
      {
        type: String, // stored path
      },
    ],

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);