import mongoose,{Schema} from "mongoose";
const reviewSchema=new Schema({
 userId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},
 productId:{type:Schema.Types.ObjectId,ref:"Product",required:true,index:true},
 rating:{type:Number,required:true,min:1,max:5},title:{type:String,required:true,trim:true,maxlength:80},comment:{type:String,required:true,trim:true,minlength:20,maxlength:1200},
 status:{type:String,enum:["pending","approved","rejected"],default:"pending"}
},{timestamps:true});
reviewSchema.index({userId:1,productId:1},{unique:true});
export const Review=mongoose.models.Review || mongoose.model("Review",reviewSchema);
