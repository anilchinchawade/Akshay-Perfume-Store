export type Gender = "men" | "women" | "unisex";
export type Concentration = "EDT" | "EDP" | "Parfum" | "Cologne";
export type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating" | "popularity";

export interface ProductVariant {
  id: string;
  size: number;
  unit: "ml";
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
}

export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  shortDescription: string;
  gender: Gender;
  concentration: Concentration;
  scentFamily: string[];
  notes: FragranceNotes;
  season: string[];
  occasion: string[];
  longevity: "Light" | "Moderate" | "Long-lasting" | "Very long-lasting";
  sillage: "Soft" | "Moderate" | "Strong" | "Very strong";
  variants: ProductVariant[];
  images: { url: string; alt: string }[];
  rating: number;
  reviewCount: number;
  popularity: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isDiscoverySet: boolean;
  authenticityGuaranteed: boolean;
  batchInformation: string;
}

export interface ProductFilters {
  search: string;
  brand: string;
  gender: string;
  scentFamily: string;
  size: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  availability: string;
  sortBy: SortOption;
  page: number;
  limit: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
