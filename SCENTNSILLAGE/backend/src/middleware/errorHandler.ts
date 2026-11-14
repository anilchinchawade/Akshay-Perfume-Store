
import type {Request,Response,NextFunction} from "express";
import {ZodError} from "zod";
import mongoose from "mongoose";
export function errorHandler(error:unknown,_req:Request,res:Response,_next:NextFunction){
 if(error instanceof ZodError)return res.status(400).json({success:false,message:"Please check the submitted details.",errors:error.flatten()});
 if(error instanceof mongoose.Error.ValidationError)return res.status(400).json({success:false,message:error.message});
 if(typeof error==="object"&&error!==null&&"code" in error&&(error as {code?:number}).code===11000)return res.status(409).json({success:false,message:"A record with these details already exists."});
 const status=(error as {status?:number})?.status??500;
 if(status>=500)console.error(error);
 const message=error instanceof Error?error.message:"Unexpected server error.";
 res.status(status).json({success:false,message:status>=500?"An unexpected server error occurred.":message});
}
