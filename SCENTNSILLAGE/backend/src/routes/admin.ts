import { Router } from "express";
import mongoose from "mongoose";
import { createHash } from "node:crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Collection } from "../models/Collection.js";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

const stringArray = z.array(z.string().trim().min(1)).default([]);
const productInput = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160),
  brand: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(80),
  description: z.string().trim().min(10).max(5000),
  shortDescription: z.string().trim().min(5).max(240),
  gender: z.enum(["men", "women", "unisex"]),
  concentration: z.enum(["EDT", "EDP", "Parfum", "Cologne"]),
  scentFamily: stringArray,
  notes: z.object({ top: stringArray, middle: stringArray, base: stringArray }),
  season: stringArray,
  occasion: stringArray,
  longevity: z.string().trim().default("Moderate"),
  sillage: z.string().trim().default("Moderate"),
  variants: z.array(z.object({
    id: z.string().trim().min(1),
    size: z.number().positive(),
    unit: z.literal("ml").default("ml"),
    price: z.number().nonnegative(),
    compareAtPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative(),
    sku: z.string().trim().min(1)
  })).min(1),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().trim().default("") })).default([]),
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDiscoverySet: z.boolean().default(false),
  authenticityGuaranteed: z.boolean().default(true),
  batchInformation: z.string().default(""),
  isActive: z.boolean().default(true)
});

const slugify = (value: string) =>
  value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

adminRouter.get("/dashboard", asyncHandler(async (_req, res) => {
  const [products, orders, customers, revenue, pendingReviews, recentOrders] = await Promise.all([
    Product.countDocuments({ isActive: true }), Order.countDocuments(),
    User.countDocuments({ role: "customer", isActive: true }),
    Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Review.countDocuments({ status: "pending" }),
    Order.find().sort({ createdAt: -1 }).limit(5).select("orderNumber total status paymentStatus createdAt").lean()
  ]);
  res.json({ success: true, data: { products, orders, customers, revenue: revenue[0]?.total ?? 0, pendingReviews, recentOrders } });
}));

adminRouter.get("/products", asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const search = String(req.query.search || "").trim();
  const filter: Record<string, unknown> = {};
  if (req.query.status === "active") filter.isActive = true;
  if (req.query.status === "inactive") filter.isActive = false;
  if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { brand: { $regex: search, $options: "i" } }, { id: { $regex: search, $options: "i" } }];
  const [products, total] = await Promise.all([Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Product.countDocuments(filter)]);
  res.json({ success: true, data: { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
}));

adminRouter.post("/products", asyncHandler(async (req, res) => {
  const input = productInput.parse(req.body);
  const slug = slugify(input.slug || input.name);
  const id = input.id?.trim() || `sns-${slug}`;
  const product = await Product.create({ ...input, id, slug });
  res.status(201).json({ success: true, data: { product } });
}));

adminRouter.patch("/products/:id", asyncHandler(async (req, res) => {
  const input = productInput.partial().parse(req.body);
  const update = { ...input, ...(input.slug ? { slug: slugify(input.slug) } : {}) };
  const product = await Product.findOneAndUpdate({ id: req.params.id }, { $set: update }, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, data: { product } });
}));

// Return short-lived Cloudinary upload signature. The browser uploads directly to Cloudinary;
// the API secret is never sent to the frontend.
adminRouter.post("/uploads/signature", asyncHandler(async (_req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({ success: false, message: "Cloudinary is not configured on the server." });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "scentnsillage/products";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
  res.json({ success: true, data: { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, timestamp, folder, signature } });
}));

// Soft-delete keeps historical order references intact.
adminRouter.delete("/products/:id", asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate({ id: req.params.id }, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, data: { product } });
}));

adminRouter.get("/orders", asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const [orders, total] = await Promise.all([
    Order.find().populate("userId", "fullName email").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments()
  ]);
  res.json({ success: true, data: { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
}));

adminRouter.patch("/orders/:id/status", asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled"]), trackingNumber: z.string().max(100).optional() }).parse(req.body);
  const order = await Order.findByIdAndUpdate(req.params.id, { status: input.status, ...(input.trackingNumber !== undefined ? { trackingNumber: input.trackingNumber } : {}) }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });
  res.json({ success: true, data: { order } });
}));

adminRouter.get("/reviews", asyncHandler(async (req, res) => {
  const status = z.enum(["pending", "approved", "rejected"]).optional().parse(req.query.status);
  const filter = status ? { status } : {};
  const reviews = await Review.find(filter).populate("userId", "fullName email").populate("productId", "name brand slug").sort({ createdAt: -1 }).limit(100).lean();
  res.json({ success: true, data: { reviews } });
}));

adminRouter.patch("/reviews/:id", asyncHandler(async (req, res) => {
  const status = z.enum(["approved", "rejected"]).parse(req.body.status);
  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });
  const stats = await Review.aggregate([{ $match: { productId: new mongoose.Types.ObjectId(String(review.productId)), status: "approved" } }, { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]);
  await Product.updateOne({ _id: review.productId }, { $set: { rating: stats[0]?.avg ?? 0, reviewCount: stats[0]?.count ?? 0 } });
  res.json({ success: true, data: { review } });
}));

adminRouter.get("/customers", asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const search = String(req.query.search || "").trim();
  const filter: Record<string, unknown> = { role: "customer" };
  if (search) filter.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  const [customers, total] = await Promise.all([
    User.find(filter).select("fullName email phone isActive createdAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(filter)
  ]);
  res.json({ success: true, data: { customers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
}));


// --------------------------------------------------
// Custom collection management (admin only)
// --------------------------------------------------

const collectionInput = z.object({
  title: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).default(""),
  bannerImage: z.string().trim().default(""),
  mode: z.enum(["manual", "automatic", "hybrid"]),
  rule: z.object({
    flag: z.enum(["isNew", "isBestseller", "isFeatured", "isDiscoverySet"]).optional(),
    category: z.string().trim().max(80).optional(),
    brand: z.string().trim().max(80).optional(),
    gender: z.enum(["men", "women", "unisex"]).optional(),
  }).default({}),
  productIds: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/)).max(100).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10000).default(0),
}).superRefine((value, context) => {
  const hasRule = Boolean(value.rule.flag || value.rule.category || value.rule.brand || value.rule.gender);
  if (value.mode === "manual" && value.productIds.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["productIds"], message: "Select at least one product for a manual collection." });
  }
  if (value.mode === "automatic" && !hasRule) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["rule"], message: "Choose at least one automatic rule." });
  }
  if (value.mode === "hybrid" && (!hasRule || value.productIds.length === 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["rule"], message: "Hybrid collections need at least one automatic rule and one manually selected product." });
  }
});

const collectionSlugify = (value: string) =>
  value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

adminRouter.get("/collections", asyncHandler(async (_req, res) => {
  const collections = await Collection.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json({ success: true, data: { collections } });
}));

adminRouter.post("/collections", asyncHandler(async (req, res) => {
  const input = collectionInput.parse(req.body);
  const slug = collectionSlugify(input.slug || input.title);
  const exists = await Collection.exists({ slug });
  if (exists) return res.status(409).json({ success: false, message: "A collection with this slug already exists." });
  const collection = await Collection.create({ ...input, slug });
  res.status(201).json({ success: true, data: { collection } });
}));

adminRouter.patch("/collections/:id", asyncHandler(async (req, res) => {
  const input = collectionInput.parse(req.body);
  const slug = collectionSlugify(input.slug || input.title);
  const exists = await Collection.exists({ slug, _id: { $ne: req.params.id } });
  if (exists) return res.status(409).json({ success: false, message: "A collection with this slug already exists." });
  const collection = await Collection.findByIdAndUpdate(
    req.params.id,
    { $set: { ...input, slug } },
    { new: true, runValidators: true }
  );
  if (!collection) return res.status(404).json({ success: false, message: "Collection not found." });
  res.json({ success: true, data: { collection } });
}));

adminRouter.delete("/collections/:id", asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);
  if (!collection) return res.status(404).json({ success: false, message: "Collection not found." });
  res.json({ success: true, data: { collection } });
}));
