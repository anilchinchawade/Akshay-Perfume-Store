
import { apiRequest } from "@/services/apiClient";
export interface RazorpayOrderResponse { success:boolean; data:{orderId:string;amount:number;currency:string;keyId:string;localOrderId:string;orderNumber:string}; }
export interface VerifyPaymentPayload { razorpay_order_id:string;razorpay_payment_id:string;razorpay_signature:string; }
export interface VerifyPaymentResponse { success:boolean;data:{verified:boolean;paymentId:string;orderNumber:string;orderId:string;total:number}; }
export interface CheckoutPayload {
 items:{productId:string;variantId:string;quantity:number}[];
 shippingAddress:{fullName:string;email:string;phone:string;address:string;city:string;state:string;pincode:string};
}
export const paymentService={
 createOrder:(payload:CheckoutPayload)=>apiRequest<RazorpayOrderResponse>("/payments/razorpay/order",{method:"POST",body:payload}),
 verify:(payload:VerifyPaymentPayload)=>apiRequest<VerifyPaymentResponse>("/payments/razorpay/verify",{method:"POST",body:payload})
};
