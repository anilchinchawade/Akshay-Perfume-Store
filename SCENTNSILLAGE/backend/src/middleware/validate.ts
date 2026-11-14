import type {Request,Response,NextFunction} from "express";
import type {ZodType} from "zod";
export const validate=(schema:ZodType)=>(req:Request,res:Response,next:NextFunction)=>{
 const parsed=schema.safeParse(req.body);
 if(!parsed.success) return res.status(400).json({success:false,message:"Please check the submitted details.",errors:parsed.error.flatten()});
 req.body=parsed.data; next();
};
