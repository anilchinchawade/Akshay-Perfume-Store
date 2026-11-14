
import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { z } from "zod";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

// Dashboard statistics
adminRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const [
      products,
      orders,
      customers,
      revenue,
      pendingReviews,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Review.countDocuments({ status: "pending" }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        orders,
        customers,
        revenue: revenue[0]?.total ?? 0,
        pendingReviews,
      },
    });
  })
);

// Get all orders
adminRouter.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20)
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: { orders },
    });
  })
);

// Update order status
adminRouter.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const status = z
      .enum([
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .parse(req.body.status);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        trackingNumber: req.body.trackingNumber,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  })
);


// import {Router} from "express";\nimport mongoose from "mongoose";\nimport {User} from "../models/User.js";
// import {z} from "zod";
// import {requireAuth,requireAdmin} from "../middleware/auth.js";
// import {Product} from "../models/Product.js";
// import {Review} from "../models/Review.js";
// import {Order} from "../models/Order.js";
// import {asyncHandler} from "../utils/asyncHandler.js";
// export const adminRouter=Router();adminRouter.use(requireAuth,requireAdmin);
// adminRouter.get("/dashboard",asyncHandler(async(_req,res)=>{
//  const [products,orders,customers,revenue,pendingReviews]=await Promise.all([
//   Product.countDocuments({isActive:true}),Order.countDocuments(),User.countDocuments({role:"customer"}),
//   Order.aggregate([{$match:{paymentStatus:"paid"}},{$group:{_id:null,total:{$sum:"$total"}}}]),Review.countDocuments({status:"pending"})
//  ]);
//  res.json({success:true,data:{products,orders,customers,revenue:revenue[0]?.total??0,pendingReviews}});
// }));
// adminRouter.get("/orders",asyncHandler(async(req,res)=>{const page=Math.max(1,Number(req.query.page)||1);const orders=await Order.find().sort({createdAt:-1}).skip((page-1)*20).limit(20).lean();res.json({success:true,data:{orders}});}));
// adminRouter.patch("/orders/:id/status",asyncHandler(async(req,res)=>{
//  const status=z.enum(["confirmed","processing","shipped","delivered","cancelled"]).parse(req.body.status);
//  const order=await Order.findByIdAndUpdate(req.params.id,{status,trackingNumber:req.body.trackingNumber},{new:true});
//  if(!order)return res.status(404).json({success:false,message:"Order not found."});res.json({success:true,data:{order}});
// }));
// adminRouter.patch("/reviews/:id",asyncHandler(async(req,res)=>{
//  const status=z.enum(["approved","rejected"]).parse(req.body.status);
//  const review=await Review.findByIdAndUpdate(req.params.id,{status},{new:true});
//  if(!review)return res.status(404).json({success:false,message:"Review not found."});
//  await refreshProductRating(String(review.productId));res.json({success:true,data:{review}});
// }));
// async function refreshProductRating(productId:string){
//  const stats=await Review.aggregate([{$match:{productId:new mongoose.Types.ObjectId(productId),status:"approved"}},{$group:{_id:null,avg:{$avg:"$rating"},count:{$sum:1}}}]);
//  await Product.updateOne({_id:productId},{$set:{rating:stats[0]?.avg??0,reviewCount:stats[0]?.count??0}});
// }
// adminRouter.post("/products",asyncHandler(async(req,res)=>{
//  const input=z.object({id:z.string(),name:z.string(),slug:z.string(),brand:z.string(),category:z.string(),description:z.string(),shortDescription:z.string(),gender:z.enum(["men","women","unisex"]),concentration:z.enum(["EDT","EDP","Parfum","Cologne"]),scentFamily:z.array(z.string()),notes:z.object({top:z.array(z.string()),middle:z.array(z.string()),base:z.array(z.string())}),season:z.array(z.string()),occasion:z.array(z.string()),longevity:z.string(),sillage:z.string(),variants:z.array(z.object({id:z.string(),size:z.number(),unit:z.string(),price:z.number(),stock:z.number(),sku:z.string()})),images:z.array(z.object({url:z.string().url(),alt:z.string()}))}).passthrough().parse(req.body);
//  const product=await Product.create(input);res.status(201).json({success:true,data:{product}});
// }));
// adminRouter.patch("/products/:id",asyncHandler(async(req,res)=>{
//  const product=await Product.findOneAndUpdate({id:req.params.id},req.body,{new:true,runValidators:true});
//  if(!product)return res.status(404).json({success:false,message:"Product not found."});res.json({success:true,data:{product}});
// }));
