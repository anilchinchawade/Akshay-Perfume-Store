import { apiRequest } from "@/services/apiClient";
import type { Product } from "@/features/products/types/product.types";

export interface AdminProduct extends Product { _id: string; isActive: boolean; }
export type CollectionMode = "manual" | "automatic" | "hybrid";
export interface AdminCollectionRule { flag?: "isNew" | "isBestseller" | "isFeatured" | "isDiscoverySet"; category?: string; brand?: string; gender?: "men" | "women" | "unisex"; }
export interface AdminCollection { _id: string; title: string; slug: string; description: string; bannerImage: string; mode: CollectionMode; rule: AdminCollectionRule; productIds: string[]; isActive: boolean; sortOrder: number; }
export interface AdminOrder { _id: string; orderNumber: string; total: number; status: string; paymentStatus: string; trackingNumber?: string; createdAt: string; userId?: { fullName?: string; email?: string }; }
export interface AdminReview { _id: string; rating: number; title: string; comment: string; status: string; createdAt: string; userId?: { fullName?: string; email?: string }; productId?: { name?: string; brand?: string }; }
export interface AdminCustomer { _id: string; fullName: string; email: string; phone?: string; isActive: boolean; createdAt: string; }
export interface DashboardStats { products: number; orders: number; customers: number; revenue: number; pendingReviews: number; recentOrders: AdminOrder[]; }
interface ApiResult<T> { success: boolean; data: T; }
export interface CloudinarySignature { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string; }

export const adminService = {
  dashboard: () => apiRequest<ApiResult<DashboardStats>>("/admin/dashboard"),
  products: (search = "", limit = 20) => apiRequest<ApiResult<{ products: AdminProduct[]; pagination: { page: number; pages: number; total: number } }>>(`/admin/products?search=${encodeURIComponent(search)}&limit=${limit}`),
  saveProduct: (data: Record<string, unknown>, id?: string) => apiRequest<ApiResult<{ product: AdminProduct }>>(id ? `/admin/products/${encodeURIComponent(id)}` : "/admin/products", { method: id ? "PATCH" : "POST", body: data }),
  deactivateProduct: (id: string) => apiRequest<ApiResult<{ product: AdminProduct }>>(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }),
  collections: () => apiRequest<ApiResult<{ collections: AdminCollection[] }>>("/admin/collections"),
  saveCollection: (data: Omit<AdminCollection, "_id">, id?: string) => apiRequest<ApiResult<{ collection: AdminCollection }>>(id ? `/admin/collections/${encodeURIComponent(id)}` : "/admin/collections", { method: id ? "PATCH" : "POST", body: data }),
  deleteCollection: (id: string) => apiRequest<ApiResult<{ collection: AdminCollection }>>(`/admin/collections/${encodeURIComponent(id)}`, { method: "DELETE" }),
  cloudinarySignature: () => apiRequest<ApiResult<CloudinarySignature>>("/admin/uploads/signature", { method: "POST" }),
  orders: () => apiRequest<ApiResult<{ orders: AdminOrder[] }>>("/admin/orders"),
  updateOrder: (id: string, status: string, trackingNumber: string) => apiRequest<ApiResult<{ order: AdminOrder }>>(`/admin/orders/${id}/status`, { method: "PATCH", body: { status, trackingNumber } }),
  reviews: (status = "pending") => apiRequest<ApiResult<{ reviews: AdminReview[] }>>(`/admin/reviews?status=${status}`),
  moderateReview: (id: string, status: "approved" | "rejected") => apiRequest<ApiResult<{ review: AdminReview }>>(`/admin/reviews/${id}`, { method: "PATCH", body: { status } }),
  customers: (search = "") => apiRequest<ApiResult<{ customers: AdminCustomer[] }>>(`/admin/customers?search=${encodeURIComponent(search)}`)
};
