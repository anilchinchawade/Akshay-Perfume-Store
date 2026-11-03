import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { z } from "zod";
import { env } from "../config/env.js";

export const paymentsRouter = Router();
const createOrderSchema = z.object({
  amount: z.number().int().positive().max(5_000_000),
  currency: z.literal("INR"),
  receipt: z.string().min(5).max(40)
});
const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1)
});
function getRazorpay() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay test credentials are not configured on the server.");
  }
  return new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
}

paymentsRouter.post("/razorpay/order", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success:false, message:"Invalid payment order details.", errors:parsed.error.flatten() });
  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      receipt: parsed.data.receipt
    });
    return res.status(201).json({
      success:true,
      data:{ orderId:order.id, amount:order.amount, currency:order.currency, keyId:env.RAZORPAY_KEY_ID }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Razorpay order.";
    return res.status(503).json({ success:false, message });
  }
});

paymentsRouter.post("/razorpay/verify", (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success:false, message:"Invalid payment verification details." });
  if (!env.RAZORPAY_KEY_SECRET) return res.status(503).json({ success:false, message:"Payment verification is not configured." });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
  const expected = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const received = Buffer.from(razorpay_signature, "hex");
  const calculated = Buffer.from(expected, "hex");
  const valid = received.length === calculated.length && crypto.timingSafeEqual(received, calculated);
  if (!valid) return res.status(400).json({ success:false, message:"Payment signature verification failed." });
  return res.status(200).json({ success:true, data:{ verified:true, paymentId:razorpay_payment_id } });
});
