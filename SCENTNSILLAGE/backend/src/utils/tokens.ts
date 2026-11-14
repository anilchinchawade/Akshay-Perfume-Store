import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";
export interface TokenPayload { sub:string; role:"customer"|"admin"; typ:"access"|"refresh"; }
export function signAccessToken(user:{id:string;role:"customer"|"admin"}) {
 return jwt.sign({sub:user.id,role:user.role,typ:"access"},env.JWT_ACCESS_SECRET,{expiresIn:env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"]});
}
export function signRefreshToken(user:{id:string;role:"customer"|"admin"}) {
 return jwt.sign({sub:user.id,role:user.role,typ:"refresh"},env.JWT_REFRESH_SECRET,{expiresIn:`${env.REFRESH_TOKEN_DAYS}d`});
}
export function verifyAccessToken(token:string) { return jwt.verify(token,env.JWT_ACCESS_SECRET) as TokenPayload; }
export function verifyRefreshToken(token:string) { return jwt.verify(token,env.JWT_REFRESH_SECRET) as TokenPayload; }
export const hashToken=(token:string)=>crypto.createHash("sha256").update(token).digest("hex");
