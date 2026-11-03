import express from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRouter } from "./routes/health.js";
import { paymentsRouter } from "./routes/payments.js";
import { env } from "./config/env.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/v1", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SCENTNSILLAGE API is running",
    data: { version: "1.0.0" }
  });
});

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/payments", paymentsRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});
