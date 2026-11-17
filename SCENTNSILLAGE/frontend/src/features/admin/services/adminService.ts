import { apiRequest } from "@/services/apiClient";

export interface AdminProduct { _id: string; id: string; name: string; brand: string; slug: string; isActive: boolean; variants: { id: string; size: number; unit?: string; price: number; stock: number }[]; }
export interface AdminOrder { _id: string; orderNumber: string; total: number; status: string; paymentStatus: string; trackingNumber?: string; createdAt: string; userId?: { fullName?: string; email?: string }; }
export interface AdminReview { _id: string; rating: number; title: string; comment: string; status: string; createdAt: string; userId?: { fullName?: string; email?: string }; productId?: { name?: string; brand?: string }; }
export interface AdminCustomer { _id: string; fullName: string; email: string; phone?: string; isActive: boolean; createdAt: string; }
export interface DashboardStats { products: number; orders: number; customers: number; revenue: number; pendingReviews: number; recentOrders: AdminOrder[]; }
interface ApiResult<T> { success: boolean; data: T; }
export const adminService = {
  dashboard: () => apiRequest<ApiResult<DashboardStats>>("/admin/dashboard"),
  products: (search = "") => apiRequest<ApiResult<{ products: AdminProduct[]; pagination: { page: number; pages: number; total: number } }>>(`/admin/products?search=${encodeURIComponent(search)}`),
  saveProduct: (data: Record<string, unknown>, id?: string) => apiRequest<ApiResult<{ product: AdminProduct }>>(id ? `/admin/products/${encodeURIComponent(id)}` : "/admin/products", { method: id ? "PATCH" : "POST", body: data }),
  deactivateProduct: (id: string) => apiRequest<ApiResult<{ product: AdminProduct }>>(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }),
  orders: () => apiRequest<ApiResult<{ orders: AdminOrder[] }>>("/admin/orders"),
  updateOrder: (id: string, status: string, trackingNumber: string) => apiRequest<ApiResult<{ order: AdminOrder }>>(`/admin/orders/${id}/status`, { method: "PATCH", body: { status, trackingNumber } }),
  reviews: (status = "pending") => apiRequest<ApiResult<{ reviews: AdminReview[] }>>(`/admin/reviews?status=${status}`),
  moderateReview: (id: string, status: "approved" | "rejected") => apiRequest<ApiResult<{ review: AdminReview }>>(`/admin/reviews/${id}`, { method: "PATCH", body: { status } }),
  customers: (search = "") => apiRequest<ApiResult<{ customers: AdminCustomer[] }>>(`/admin/customers?search=${encodeURIComponent(search)}`)
};
