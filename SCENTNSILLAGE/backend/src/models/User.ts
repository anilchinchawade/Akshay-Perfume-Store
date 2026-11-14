import mongoose,{Schema, type InferSchemaType} from "mongoose";
const userSchema=new Schema({
 fullName:{type:String,required:true,trim:true,minlength:2,maxlength:100},
 email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
 phone:{type:String,trim:true},
 passwordHash:{type:String,required:true,select:false},
 role:{type:String,enum:["customer","admin"],default:"customer"},
 isActive:{type:Boolean,default:true},
 refreshTokenHash:{type:String,select:false},
 refreshTokenExpiresAt:{type:Date,select:false}
},{timestamps:true});
export type UserDocument=InferSchemaType<typeof userSchema> & mongoose.Document;
export const User=mongoose.models.User || mongoose.model("User",userSchema);
