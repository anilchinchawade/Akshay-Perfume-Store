import {Router} from "express";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import {z} from "zod";
import {env} from "../config/env.js";
import {requireAuth} from "../middleware/auth.js";
import {Product} from "../models/Product.js";
import {Order} from "../models/Order.js";
import {asyncHandler} from "../utils/asyncHandler.js";
export const paymentsRouter=Router();
const checkoutSchema=z.object({
 items:z.array(z.object({productId:z.string().min(1),variantId:z.string().min(1),quantity:z.number().int().min(1).max(10)})).min(1).max(30),
 shippingAddress:z.object({fullName:z.string().min(2),email:z.string().email(),phone:z.string().regex(/^[6-9]\d{9}$/),address:z.string().min(8),city:z.string().min(2),state:z.string().min(2),pincode:z.string().regex(/^\d{6}$/)})
});
function client(){if(!env.RAZORPAY_KEY_ID||!env.RAZORPAY_KEY_SECRET)throw new Error("Razorpay credentials are not configured.");return new Razorpay({key_id:env.RAZORPAY_KEY_ID,key_secret:env.RAZORPAY_KEY_SECRET});}
paymentsRouter.post("/razorpay/order",requireAuth,asyncHandler(async(req,res)=>{
 const input=checkoutSchema.parse(req.body);
 const productIds=[...new Set(input.items.map(i=>i.productId))];
 const products=await Product.find({id:{$in:productIds},isActive:true});
 const byId=new Map(products.map(p=>[p.id,p]));
 let subtotal=0;const orderItems:any[]=[];
 for(const line of input.items){
  const product=byId.get(line.productId);const variant=product?.variants.find(v=>v.id===line.variantId);
  if(!product||!variant) return res.status(400).json({success:false,message:"A selected fragrance or size is no longer available."});
  if(variant.stock<line.quantity) return res.status(409).json({success:false,message:`Insufficient stock for ${product.name}.`});
  subtotal+=variant.price*line.quantity;
  orderItems.push({productId:product._id,productName:product.name,productSlug:product.slug,variantId:variant.id,size:`${variant.size} ml`,quantity:line.quantity,unitPrice:variant.price,image:product.images[0]?.url??""});
 }
 const shippingFee=subtotal>=2500?0:99,total=subtotal+shippingFee;
 const orderNumber=`SNS-${Date.now().toString().slice(-8)}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
 const localOrder=await Order.create({orderNumber,userId:req.auth!.userId,items:orderItems,shippingAddress:input.shippingAddress,subtotal,shippingFee,total,paymentStatus:"pending",status:"pending"});
 try{
  const rp=client();const rpOrder=await rp.orders.create({amount:Math.round(total*100),currency:"INR",receipt:orderNumber,notes:{localOrderId:String(localOrder._id),customerId:req.auth!.userId}});
  localOrder.razorpayOrderId=rpOrder.id;await localOrder.save();
  res.status(201).json({success:true,data:{orderId:rpOrder.id,amount:rpOrder.amount,currency:rpOrder.currency,keyId:env.RAZORPAY_KEY_ID,localOrderId:String(localOrder._id),orderNumber}});
 }catch(error){await Order.deleteOne({_id:localOrder._id});throw error;}
}));
paymentsRouter.post("/razorpay/verify",requireAuth,asyncHandler(async(req,res)=>{
 const input=z.object({razorpay_order_id:z.string().min(1),razorpay_payment_id:z.string().min(1),razorpay_signature:z.string().min(1)}).parse(req.body);
 if(!env.RAZORPAY_KEY_SECRET)return res.status(503).json({success:false,message:"Payment verification is not configured."});
 const order=await Order.findOne({razorpayOrderId:input.razorpay_order_id,userId:req.auth!.userId});
 if(!order)return res.status(404).json({success:false,message:"Pending order not found."});
 const expected=crypto.createHmac("sha256",env.RAZORPAY_KEY_SECRET).update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`).digest("hex");
 const a=Buffer.from(expected,"hex"),b=Buffer.from(input.razorpay_signature,"hex");
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({success:false,message:"Payment signature verification failed."});
 if(order.paymentStatus!=="paid"){
  // Reserve stock only after payment has been verified; conditional updates prevent overselling.
  for(const line of order.items){
   const result=await Product.updateOne({ _id:line.productId, variants:{$elemMatch:{id:line.variantId,stock:{$gte:line.quantity}}} },{$inc:{"variants.$.stock":-line.quantity}});
   if(result.modifiedCount!==1)return res.status(409).json({success:false,message:`Stock changed for ${line.productName}. Please contact support with your payment ID.`});
  }
  order.paymentStatus="paid";order.status="confirmed";order.razorpayPaymentId=input.razorpay_payment_id;order.paidAt=new Date();await order.save();
 }
 res.json({success:true,data:{verified:true,paymentId:input.razorpay_payment_id,orderNumber:order.orderNumber,orderId:String(order._id),total:order.total}});
}));
