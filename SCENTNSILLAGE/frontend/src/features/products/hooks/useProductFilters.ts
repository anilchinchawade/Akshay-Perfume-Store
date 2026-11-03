import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductFilters, SortOption } from "@/features/products/types/product.types";

const defaults: ProductFilters = {
  search: "", brand: "", gender: "", scentFamily: "", size: "", minPrice: "", maxPrice: "", minRating: "", availability: "", sortBy: "featured", page: 1, limit: 9
};

export function useProductFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo<ProductFilters>(() => ({
    search: params.get("q") ?? "", brand: params.get("brand") ?? "", gender: params.get("gender") ?? "",
    scentFamily: params.get("scentFamily") ?? "", size: params.get("size") ?? "", minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "", minRating: params.get("minRating") ?? "", availability: params.get("availability") ?? "",
    sortBy: (params.get("sortBy") as SortOption) ?? "featured", page: Math.max(1, Number(params.get("page") ?? 1)), limit: 9
  }), [params]);

  const updateFilters = (updates: Partial<ProductFilters>) => {
    const next = new URLSearchParams(params);
    const keyMap: Record<string, string> = { search: "q" };
    Object.entries(updates).forEach(([key, value]) => {
      const param = keyMap[key] ?? key;
      if (value === "" || value === undefined || value === null || value === defaults[key as keyof ProductFilters]) next.delete(param);
      else next.set(param, String(value));
    });
    if (!("page" in updates)) next.delete("page");
    setParams(next, { replace: true });
  };
  const clearFilters = () => setParams({}, { replace: true });
  return { filters, updateFilters, clearFilters };
}
