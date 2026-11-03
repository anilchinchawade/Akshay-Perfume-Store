import { apiRequest } from "@/services/apiClient";
import type { Customer } from "@/store/slices/authSlice";
export interface CustomerOrder {
  id:string; orderNumber:string; createdAt:string; status:"pending"|"confirmed"|"processing"|"shipped"|"delivered"|"cancelled";
  paymentStatus:"pending"|"paid"|"failed"|"refunded"; total:number; items:{productName:string;size:string;quantity:number;image:string;productSlug?:string}[];
  trackingNumber?:string;
}
export const accountService = {
  orders:()=>apiRequest<{success:boolean;data:{orders:CustomerOrder[]}}>("/users/me/orders"),
  profile:()=>apiRequest<{success:boolean;data:{user:Customer}}>("/users/me"),
  updateProfile:(payload:{fullName:string;phone?:string})=>apiRequest<{success:boolean;data:{user:Customer}}>("/users/me",{method:"PATCH",body:payload})
};
