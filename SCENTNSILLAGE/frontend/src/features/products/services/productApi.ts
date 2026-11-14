import {apiRequest} from "@/services/apiClient";
import type {Product,ProductFilters,ProductPage} from "@/features/products/types/product.types";
export const productApi={
 list:(filters:ProductFilters)=>apiRequest<{success:boolean;data:ProductPage}>(`/products?${new URLSearchParams({
  search:filters.search,brand:filters.brand,gender:filters.gender,scentFamily:filters.scentFamily,size:filters.size,minPrice:filters.minPrice,maxPrice:filters.maxPrice,minRating:filters.minRating,availability:filters.availability,sortBy:filters.sortBy,page:String(filters.page),limit:String(filters.limit)
 }).toString()}`).then(r=>r.data),
 bySlug:(slug:string)=>apiRequest<{success:boolean;data:{product:Product}}>(`/products/${encodeURIComponent(slug)}`).then(r=>r.data.product)
};
