import mongoose,{Schema} from "mongoose";
const orderItemSchema=new Schema({productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},productName:{type:String,required:true},productSlug:String,variantId:{type:String,required:true},size:String,quantity:{type:Number,required:true,min:1},unitPrice:{type:Number,required:true},image:String},{_id:false});
const orderSchema=new Schema({
 orderNumber:{type:String,required:true,unique:true,index:true},userId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},
 items:{type:[orderItemSchema],required:true},shippingAddress:{fullName:String,email:String,phone:String,address:String,city:String,state:String,pincode:String},
 subtotal:{type:Number,required:true},shippingFee:{type:Number,required:true},total:{type:Number,required:true},currency:{type:String,default:"INR"},
 status:{type:String,enum:["pending","confirmed","processing","shipped","delivered","cancelled"],default:"pending"},
 paymentStatus:{type:String,enum:["pending","paid","failed","refunded"],default:"pending"},
 razorpayOrderId:String,razorpayPaymentId:String,trackingNumber:String,paidAt:Date
},{timestamps:true});
export const Order=mongoose.models.Order || mongoose.model("Order",orderSchema);
