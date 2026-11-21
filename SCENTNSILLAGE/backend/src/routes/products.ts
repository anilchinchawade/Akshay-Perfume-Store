import { Router } from "express";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Collection } from "../models/Collection.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const productsRouter = Router();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type SortSpec = Record<string, 1 | -1>;

productsRouter.get("/", asyncHandler(async (req, res) => {
  const q = String(req.query.search ?? "").trim();
  const filter: Record<string, any> = { isActive: true };
  if (q) filter.$text = { $search: q };
  for (const key of ["brand", "gender"]) {
    if (req.query[key]) filter[key] = new RegExp(`^${escapeRegex(String(req.query[key]))}$`, "i");
  }
  if (req.query.scentFamily) filter.scentFamily = { $in: [new RegExp(escapeRegex(String(req.query.scentFamily)), "i")] };
  if (req.query.availability === "in-stock") filter["variants.stock"] = { $gt: 0 };
  if (req.query.minRating) filter.rating = { $gte: Number(req.query.minRating) };
  if (req.query.minPrice || req.query.maxPrice) {
    const prices: Record<string, number> = {};
    if (req.query.minPrice) prices.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) prices.$lte = Number(req.query.maxPrice);
    filter.variants = { $elemMatch: { price: prices } };
  }
  if (req.query.size) filter["variants.size"] = Number(req.query.size);

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 9));
  const sortMap: Record<string, SortSpec> = {
    featured: { isFeatured: -1, popularity: -1 },
    newest: { createdAt: -1 },
    "price-asc": { "variants.price": 1 },
    "price-desc": { "variants.price": -1 },
    rating: { rating: -1 },
    popularity: { popularity: -1 },
  };
  const sort = sortMap[String(req.query.sortBy)] ?? sortMap.featured;
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page, limit, totalPages: Math.ceil(total / limit) } });
}));

productsRouter.get("/featured", asyncHandler(async (_req, res) => {
  const items = await Product.find({ isActive: true, isFeatured: true }).sort({ popularity: -1 }).limit(8).lean();
  res.json({ success: true, data: { items } });
}));

// Phase 9.2 automatic collections.
productsRouter.get("/collections/:collection", asyncHandler(async (req, res) => {
  const collection = String(req.params.collection);
  const flags: Record<string, string> = { new: "isNew", bestsellers: "isBestseller", featured: "isFeatured", "discovery-sets": "isDiscoverySet" };
  const flag = flags[collection];
  if (!flag) return res.status(404).json({ success: false, message: "Collection not found." });
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 8));
  const filter: Record<string, any> = { isActive: true, [flag]: true };
  const collectionSort: SortSpec = collection === "new" ? { createdAt: -1 } : collection === "bestsellers" ? { popularity: -1, rating: -1 } : { popularity: -1, createdAt: -1 };
  const [items, total] = await Promise.all([
    Product.find(filter).sort(collectionSort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page, limit, totalPages: Math.ceil(total / limit) } });
}));

productsRouter.get("/collections/category/:category", asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 8));
  const filter = { isActive: true, category: new RegExp(`^${escapeRegex(String(req.params.category))}$`, "i") };
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ popularity: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page, limit, totalPages: Math.ceil(total / limit) } });
}));

// Resolve manual product order and optional automatic rule results.
async function resolveCollectionProducts(collection: any, limit = 8) {
  const manualIds: string[] = (collection.productIds ?? []).map((id: unknown) => String(id));
  const manualFound = manualIds.length ? await Product.find({ _id: { $in: manualIds }, isActive: true }).lean() : [];
  const manualById = new Map(manualFound.map(product => [String(product._id), product]));
  const manualProducts = manualIds.map(id => manualById.get(id)).filter((product): product is (typeof manualFound)[number] => Boolean(product));
  if (collection.mode === "manual") return manualProducts.slice(0, limit);

  const rule = collection.rule ?? {};
  const automaticFilter: Record<string, any> = { isActive: true };
  if (rule.flag) automaticFilter[rule.flag] = true;
  if (rule.category) automaticFilter.category = new RegExp(`^${escapeRegex(String(rule.category))}$`, "i");
  if (rule.brand) automaticFilter.brand = new RegExp(`^${escapeRegex(String(rule.brand))}$`, "i");
  if (rule.gender) automaticFilter.gender = rule.gender;
  if (Object.keys(automaticFilter).length === 1) return manualProducts.slice(0, limit);

  const automaticProducts = await Product.find(automaticFilter)
    .sort({ popularity: -1, createdAt: -1 })
    .limit(limit + manualIds.length)
    .lean();
  if (collection.mode === "automatic") return automaticProducts.slice(0, limit);
  const seen = new Set(manualProducts.map(product => String(product._id)));
  const merged = [...manualProducts, ...automaticProducts.filter(product => !seen.has(String(product._id)))];
  return merged.slice(0, limit);
}

// Public custom collections are separate from /collections/:collection to avoid route conflicts.
productsRouter.get("/custom-collections", asyncHandler(async (_req, res) => {
  const collections = await Collection.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  const results = await Promise.all(collections.map(async collection => ({
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    bannerImage: collection.bannerImage,
    products: await resolveCollectionProducts(collection, 8),
  })));
  res.json({ success: true, data: { collections: results } });
}));

productsRouter.get("/custom-collections/:slug", asyncHandler(async (req, res) => {
  // const collection = await Collection.findOne({ slug: req.params.slug, isActive: true }).lean();
  type PublicCollection = {
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  [key: string]: unknown;
};
  const collection = (await Collection.findOne({
  slug: req.params.slug,
  isActive: true,
}).lean().exec()) as PublicCollection | null;
  if (!collection) return res.status(404).json({ success: false, message: "Collection not found." });
  const products = await resolveCollectionProducts(collection, 48);
  res.json({ success: true, data: { collection: { title: collection.title, slug: collection.slug, description: collection.description, bannerImage: collection.bannerImage, products } } });
}));

productsRouter.get("/slug/:slug", asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!product) return res.status(404).json({ success: false, message: "Fragrance not found." });
  res.json({ success: true, data: { product } });
}));

productsRouter.get("/:slug/reviews", asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).select("_id");
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  const reviews = await Review.find({ productId: product._id, status: "approved" }).populate("userId", "fullName").sort({ createdAt: -1 }).limit(50).lean();
  const total = reviews.length;
  const averageRating = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
  res.json({ success: true, data: { reviews: reviews.map((review: any) => ({
    id: String(review._id), productId: String(review.productId), productName: "", productSlug: req.params.slug,
    rating: review.rating, title: review.title, comment: review.comment, createdAt: review.createdAt,
    status: review.status, customerName: review.userId?.fullName ?? "Customer",
  })), averageRating, total } });
}));

productsRouter.get("/:slug", asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!product) return res.status(404).json({ success: false, message: "Fragrance not found." });
  res.json({ success: true, data: { product } });
}));
