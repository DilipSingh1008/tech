const mongoose = require("mongoose");

const faqCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FaqCategory", faqCategorySchema);
