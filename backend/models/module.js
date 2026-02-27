const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {collection: "Module"},
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);