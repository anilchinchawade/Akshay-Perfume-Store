import {Router} from "express";
import {Product} from "../models/Product.js";
import {Review} from "../models/Review.js";
import {asyncHandler} from "../utils/asyncHandler.js";
export const productsRouter=Router();
productsRouter.get("/",asyncHandler(async(req,res)=>{
 const q=String(req.query.search??"").trim();
 const filter:any={isActive:true};
 if(q) filter.$text={$search:q};
 for(const key of ["brand","gender"]) if(req.query[key]) filter[key]=new RegExp(`^${String(req.query[key]).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}$`,"i");
 if(req.query.scentFamily) filter.scentFamily={$in:[new RegExp(String(req.query.scentFamily),"i")]};
 if(req.query.availability==="in-stock") filter["variants.stock"]={$gt:0};
 if(req.query.minRating) filter.rating={$gte:Number(req.query.minRating)};
 if(req.query.minPrice||req.query.maxPrice){
  const prices:any={};if(req.query.minPrice) prices.$gte=Number(req.query.minPrice);if(req.query.maxPrice) prices.$lte=Number(req.query.maxPrice);
  filter.variants={$elemMatch:{price:prices}};
 }
 if(req.query.size) filter["variants.size"]=Number(req.query.size);
 const page=Math.max(1,Number(req.query.page)||1),limit=Math.min(48,Math.max(1,Number(req.query.limit)||9));
 const sortMap:any={featured:{isFeatured:-1,popularity:-1},newest:{createdAt:-1}, "price-asc":{"variants.price":1},"price-desc":{"variants.price":-1},rating:{rating:-1},popularity:{popularity:-1}};
 const sort=sortMap[String(req.query.sortBy)]??sortMap.featured;
 const [items,total]=await Promise.all([Product.find(filter).sort(sort).skip((page-1)*limit).limit(limit).lean(),Product.countDocuments(filter)]);
 res.json({success:true,data:{items,total,page,limit,totalPages:Math.ceil(total/limit)}});
}));
productsRouter.get("/featured",asyncHandler(async(_req,res)=>{const items=await Product.find({isActive:true,isFeatured:true}).sort({popularity:-1}).limit(8).lean();res.json({success:true,data:{items}});}));
productsRouter.get("/slug/:slug",asyncHandler(async(req,res)=>{const product=await Product.findOne({slug:req.params.slug,isActive:true}).lean();if(!product)return res.status(404).json({success:false,message:"Fragrance not found."});res.json({success:true,data:{product}});}));
productsRouter.get("/:slug/reviews",asyncHandler(async(req,res)=>{
 const product=await Product.findOne({slug:req.params.slug,isActive:true}).select("_id");if(!product)return res.status(404).json({success:false,message:"Product not found."});
 const reviews=await Review.find({productId:product._id,status:"approved"}).populate("userId","fullName").sort({createdAt:-1}).limit(50).lean();
 const total=reviews.length,averageRating=total?reviews.reduce((s,r)=>s+r.rating,0)/total:0;
 res.json({success:true,data:{reviews:reviews.map((r:any)=>({id:String(r._id),productId:String(r.productId),productName:"",productSlug:req.params.slug,rating:r.rating,title:r.title,comment:r.comment,createdAt:r.createdAt,status:r.status,customerName:r.userId?.fullName??"Customer"})),averageRating,total}});
}));
productsRouter.get("/:slug",asyncHandler(async(req,res)=>{const product=await Product.findOne({slug:req.params.slug,isActive:true}).lean();if(!product)return res.status(404).json({success:false,message:"Fragrance not found."});res.json({success:true,data:{product}});}));
