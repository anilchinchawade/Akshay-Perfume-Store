import {Router} from "express";
import {z} from "zod";
import {Review} from "../models/Review.js";
import {Product} from "../models/Product.js";
import {Order} from "../models/Order.js";
import {requireAuth} from "../middleware/auth.js";
import {asyncHandler} from "../utils/asyncHandler.js";
export const reviewsRouter=Router();
reviewsRouter.post("/",requireAuth,asyncHandler(async(req,res)=>{
 const input=z.object({productId:z.string().min(1),rating:z.number().int().min(1).max(5),title:z.string().trim().min(3).max(80),comment:z.string().trim().min(20).max(1200)}).parse(req.body);
 const product=await Product.findOne({id:input.productId,isActive:true});
 if(!product)return res.status(404).json({success:false,message:"Product not found."});
 const purchased=await Order.exists({userId:req.auth!.userId,"items.productId":product._id,paymentStatus:"paid",status:{$in:["confirmed","processing","shipped","delivered"]}});
 if(!purchased)return res.status(403).json({success:false,message:"Only verified customers who purchased this fragrance can review it."});
 if(await Review.exists({userId:req.auth!.userId,productId:product._id}))return res.status(409).json({success:false,message:"You have already reviewed this fragrance."});
 const review=await Review.create({userId:req.auth!.userId,productId:product._id,...input,status:"pending"});
 res.status(201).json({success:true,data:{review:{id:review.id,productId:input.productId,rating:review.rating,title:review.title,comment:review.comment,createdAt:review.createdAt,status:review.status}}});
}));
