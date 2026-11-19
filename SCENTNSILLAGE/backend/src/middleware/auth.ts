import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/tokens.js";
// declare global { namespace Express { interface Request { auth?: { userId: string; role: "customer" | "admin" } } } }
declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      role: "customer" | "admin";
    };
  }
}
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.sns_access;
        if (!token) return res.status(401).json({ success: false, message: "Please sign in to continue." });
        const payload = verifyAccessToken(token);
        if (payload.typ !== "access") return res.status(401).json({ success: false, message: "Invalid access token." });
        const user = await User.findById(payload.sub).select("_id role isActive");
        if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Your session is no longer active." });
        req.auth = { userId: user.id, role: user.role as "customer" | "admin" }; next();
    } catch { return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again." }); }
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.auth?.role !== "admin") return res.status(403).json({ success: false, message: "Administrator access is required." });
    next();
}
