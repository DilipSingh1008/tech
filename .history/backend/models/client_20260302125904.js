const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
     
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
     
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
     
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);