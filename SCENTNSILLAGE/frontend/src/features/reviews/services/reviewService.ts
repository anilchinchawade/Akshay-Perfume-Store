import { apiRequest } from "@/services/apiClient";
export interface ProductReview { id:string; productId:string; productName:string; productSlug:string; rating:number; title:string; comment:string; createdAt:string; status:"pending"|"approved"|"rejected"; }
export const reviewService = {
  mine:()=>apiRequest<{success:boolean;data:{reviews:ProductReview[]}}>("/users/me/reviews"),
  create:(payload:{productId:string;rating:number;title:string;comment:string})=>apiRequest<{success:boolean;data:{review:ProductReview}}>("/reviews",{method:"POST",body:payload}),
  forProduct:(slug:string)=>apiRequest<{success:boolean;data:{reviews:ProductReview[];averageRating:number;total:number}}>(`/products/${encodeURIComponent(slug)}/reviews`)
};
