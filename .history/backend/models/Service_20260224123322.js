import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    description: { type: String },
    featuredImage: { type: String },
    // metaTitle: { type: String },
    // metaDescription: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);

