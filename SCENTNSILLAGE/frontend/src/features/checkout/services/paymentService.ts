import { apiRequest } from "@/services/apiClient";

export interface RazorpayOrderResponse {
  success: boolean;
  data: { orderId: string; amount: number; currency: string; keyId: string };
}
export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface VerifyPaymentResponse {
  success: boolean;
  data: { verified: boolean; paymentId: string };
}
export const paymentService = {
  createOrder: (payload: { amount: number; currency: "INR"; receipt: string }) =>
    apiRequest<RazorpayOrderResponse>("/payments/razorpay/order", { method: "POST", body: payload }),
  verify: (payload: VerifyPaymentPayload) =>
    apiRequest<VerifyPaymentResponse>("/payments/razorpay/verify", { method: "POST", body: payload })
};
