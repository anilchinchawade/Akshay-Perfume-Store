import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

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
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: { product } });
}));

adminRouter.patch("/products/:id", asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, data: { product } });
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
