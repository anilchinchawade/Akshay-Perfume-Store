import mongoose, { Schema } from "mongoose";

const collectionRuleSchema = new Schema({
  flag: { type: String, enum: ["isNew", "isBestseller", "isFeatured", "isDiscoverySet"] },
  category: { type: String, trim: true },
  brand: { type: String, trim: true },
  gender: { type: String, enum: ["men", "women", "unisex"] },
}, { _id: false });

const collectionSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  description: { type: String, default: "", trim: true, maxlength: 500 },
  bannerImage: { type: String, default: "", trim: true },
  mode: { type: String, enum: ["manual", "automatic", "hybrid"], required: true, default: "manual" },
  rule: { type: collectionRuleSchema, default: () => ({}) },
  productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

collectionSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

export const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
