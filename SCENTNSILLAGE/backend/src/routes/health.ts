import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Service healthy",
    data: {
      service: "scentnsillage-api",
      status: "ok",
      timestamp: new Date().toISOString()
    }
  });
});
