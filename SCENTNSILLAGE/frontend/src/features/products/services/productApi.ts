import { apiRequest } from "@/services/apiClient";
import type { Product, ProductFilters, ProductPage, StorefrontCustomCollection } from "@/features/products/types/product.types";

export type ProductCollection = "new" | "bestsellers" | "featured" | "discovery-sets";

export const productApi = {
  list: (filters: ProductFilters) => apiRequest<{ success: boolean; data: ProductPage }>(`/products?${new URLSearchParams({
    search: filters.search,
    brand: filters.brand,
    gender: filters.gender,
    scentFamily: filters.scentFamily,
    size: filters.size,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    availability: filters.availability,
    sortBy: filters.sortBy,
    page: String(filters.page),
    limit: String(filters.limit),
  }).toString()}`).then(response => response.data),
  bySlug: (slug: string) => apiRequest<{ success: boolean; data: { product: Product } }>(`/products/${encodeURIComponent(slug)}`).then(response => response.data.product),
  collection: (collection: ProductCollection, limit = 8) => apiRequest<{ success: boolean; data: ProductPage }>(`/products/collections/${collection}?limit=${limit}`).then(response => response.data),
  category: (category: string, limit = 8) => apiRequest<{ success: boolean; data: ProductPage }>(`/products/collections/category/${encodeURIComponent(category)}?limit=${limit}`).then(response => response.data),
  customCollections: () => apiRequest<{ success: boolean; data: { collections: StorefrontCustomCollection[] } }>("/products/custom-collections").then(response => response.data.collections),
};
