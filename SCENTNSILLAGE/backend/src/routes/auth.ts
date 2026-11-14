import {Router} from "express";
import bcrypt from "bcryptjs";
import {z} from "zod";
import rateLimit from "express-rate-limit";
import {User} from "../models/User.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {env} from "../config/env.js";
import {hashToken,signAccessToken,signRefreshToken,verifyRefreshToken} from "../utils/tokens.js";
import {requireAuth} from "../middleware/auth.js";
export const authRouter=Router();
const limiter=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false,message:{success:false,message:"Too many attempts. Please try again later."}});
const registerSchema=z.object({fullName:z.string().trim().min(2).max(100),email:z.string().email().transform(v=>v.toLowerCase()),phone:z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal("")),password:z.string().min(8).max(100).regex(/[A-Za-z]/).regex(/[0-9]/)});
const loginSchema=z.object({email:z.string().email().transform(v=>v.toLowerCase()),password:z.string().min(1).max(100)});
function setCookies(res:any,user:{id:string;role:"customer"|"admin"}) {
 const access=signAccessToken(user),refresh=signRefreshToken(user);
 const options={httpOnly:true,secure:env.COOKIE_SECURE,sameSite:"lax" as const,path:"/"};
 res.cookie("sns_access",access,{...options,maxAge:15*60*1000});
 res.cookie("sns_refresh",refresh,{...options,maxAge:env.REFRESH_TOKEN_DAYS*86400000});
 return refresh;
}
function publicUser(user:any){return {id:user.id,fullName:user.fullName,email:user.email,phone:user.phone,role:user.role};}
authRouter.post("/register",limiter,asyncHandler(async(req,res)=>{
 const input=registerSchema.parse(req.body);
 if(await User.exists({email:input.email})) return res.status(409).json({success:false,message:"An account with this email already exists."});
 const passwordHash=await bcrypt.hash(input.password,12);
 const user=await User.create({fullName:input.fullName,email:input.email,phone:input.phone||undefined,passwordHash});
 const refresh=setCookies(res,{id:user.id,role:user.role as "customer"|"admin"});
 await User.updateOne({_id:user._id},{$set:{refreshTokenHash:hashToken(refresh),refreshTokenExpiresAt:new Date(Date.now()+env.REFRESH_TOKEN_DAYS*86400000)}});
 res.status(201).json({success:true,data:{user:publicUser(user)}});
}));
authRouter.post("/login",limiter,asyncHandler(async(req,res)=>{
 const input=loginSchema.parse(req.body);
 const user=await User.findOne({email:input.email}).select("+passwordHash");
 if(!user||!user.isActive||!(await bcrypt.compare(input.password,user.passwordHash))) return res.status(401).json({success:false,message:"Email or password is incorrect."});
 const refresh=setCookies(res,{id:user.id,role:user.role as "customer"|"admin"});
 await User.updateOne({_id:user._id},{$set:{refreshTokenHash:hashToken(refresh),refreshTokenExpiresAt:new Date(Date.now()+env.REFRESH_TOKEN_DAYS*86400000)}});
 res.json({success:true,data:{user:publicUser(user)}});
}));
authRouter.get("/me",requireAuth,asyncHandler(async(req,res)=>{
 const user=await User.findById(req.auth!.userId);
 if(!user) return res.status(404).json({success:false,message:"Customer not found."});
 res.json({success:true,data:{user:publicUser(user)}});
}));
authRouter.post("/refresh",asyncHandler(async(req,res)=>{
 const token=req.cookies?.sns_refresh;
 if(!token) return res.status(401).json({success:false,message:"Refresh session missing."});
 try {
  const payload=verifyRefreshToken(token);
  if(payload.typ!=="refresh") throw new Error("Invalid token type");
  const user=await User.findById(payload.sub).select("+refreshTokenHash +refreshTokenExpiresAt");
  if(!user||!user.refreshTokenHash||user.refreshTokenHash!==hashToken(token)||!user.refreshTokenExpiresAt||user.refreshTokenExpiresAt.getTime()<Date.now()) throw new Error("Refresh token revoked");
  const refresh=setCookies(res,{id:user.id,role:user.role as "customer"|"admin"});
  user.refreshTokenHash=hashToken(refresh);user.refreshTokenExpiresAt=new Date(Date.now()+env.REFRESH_TOKEN_DAYS*86400000);await user.save();
  return res.json({success:true});
 } catch {
  res.clearCookie("sns_access",{path:"/"});res.clearCookie("sns_refresh",{path:"/"});
  return res.status(401).json({success:false,message:"Your session expired. Please sign in again."});
 }
}));
authRouter.post("/logout",asyncHandler(async(req,res)=>{
 const token=req.cookies?.sns_refresh;
 if(token){try{const payload=verifyRefreshToken(token);await User.updateOne({_id:payload.sub},{$unset:{refreshTokenHash:1,refreshTokenExpiresAt:1}});}catch{/* expired token */}}
 res.clearCookie("sns_access",{path:"/",httpOnly:true,secure:env.COOKIE_SECURE,sameSite:"lax"});
 res.clearCookie("sns_refresh",{path:"/",httpOnly:true,secure:env.COOKIE_SECURE,sameSite:"lax"});
 res.json({success:true,message:"Signed out successfully."});
}));
authRouter.patch("/change-password",requireAuth,asyncHandler(async(req,res)=>{
 const input=z.object({currentPassword:z.string().min(1),newPassword:z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/)}).parse(req.body);
 const user=await User.findById(req.auth!.userId).select("+passwordHash");
 if(!user||!(await bcrypt.compare(input.currentPassword,user.passwordHash))) return res.status(400).json({success:false,message:"Current password is incorrect."});
 user.passwordHash=await bcrypt.hash(input.newPassword,12);user.refreshTokenHash=undefined;user.refreshTokenExpiresAt=undefined;await user.save();
 res.clearCookie("sns_access",{path:"/"});res.clearCookie("sns_refresh",{path:"/"});
 res.json({success:true,message:"Password updated. Please sign in again."});
}));
