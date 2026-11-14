import {Router} from "express";
import {z} from "zod";
import {User} from "../models/User.js";
import {Order} from "../models/Order.js";
import {Review} from "../models/Review.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {requireAuth} from "../middleware/auth.js";
export const usersRouter=Router();
usersRouter.use(requireAuth);
usersRouter.get("/me",asyncHandler(async(req,res)=>{const user=await User.findById(req.auth!.userId);if(!user)return res.status(404).json({success:false,message:"Customer not found."});res.json({success:true,data:{user:{id:user.id,fullName:user.fullName,email:user.email,phone:user.phone,role:user.role}}});}));
usersRouter.patch("/me",asyncHandler(async(req,res)=>{
 const input=z.object({fullName:z.string().trim().min(2).max(100),phone:z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal(""))}).parse(req.body);
 const user=await User.findByIdAndUpdate(req.auth!.userId,{fullName:input.fullName,phone:input.phone||undefined},{new:true,runValidators:true});
 if(!user)return res.status(404).json({success:false,message:"Customer not found."});
 res.json({success:true,data:{user:{id:user.id,fullName:user.fullName,email:user.email,phone:user.phone,role:user.role}}});
}));
usersRouter.get("/me/orders",asyncHandler(async(req,res)=>{
 const orders=await Order.find({userId:req.auth!.userId}).sort({createdAt:-1}).lean();
 res.json({success:true,data:{orders:orders.map(o=>({id:String(o._id),orderNumber:o.orderNumber,createdAt:o.createdAt,status:o.status,paymentStatus:o.paymentStatus,total:o.total,items:o.items.map(i=>({productName:i.productName,size:i.size,quantity:i.quantity,image:i.image,productSlug:i.productSlug})),trackingNumber:o.trackingNumber}))}});
}));
usersRouter.get("/me/reviews",asyncHandler(async(req,res)=>{
 const reviews=await Review.find({userId:req.auth!.userId}).populate("productId","name slug").sort({createdAt:-1}).lean();
 res.json({success:true,data:{reviews:reviews.map((r:any)=>({id:String(r._id),productId:String(r.productId?._id??r.productId),productName:r.productId?.name??"Fragrance",productSlug:r.productId?.slug??"",rating:r.rating,title:r.title,comment:r.comment,createdAt:r.createdAt,status:r.status}))}});
}));
