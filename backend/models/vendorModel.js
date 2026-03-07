const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    firmName: {
      type: String,
      required: [true, "Firm name is required"],
      trim: true,
    },

    gst: {
      type: String,
      required: [true, "GST number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    contactName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      lowercase: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      lowercase: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      lowercase: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vendor", vendorSchema);
