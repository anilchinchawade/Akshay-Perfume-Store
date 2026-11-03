import { products } from "@/features/products/data/products";
import type { Product, ProductFilters, ProductPage } from "@/features/products/types/product.types";

const has = (value: string, search: string) => value.toLocaleLowerCase().includes(search.toLocaleLowerCase());

export const productService = {
  async getProducts(filters: ProductFilters): Promise<ProductPage> {
    let result = [...products];
    if (filters.search.trim()) {
      const term = filters.search.trim();
      result = result.filter(product => [product.name, product.brand, ...product.notes.top, ...product.notes.middle, ...product.notes.base, ...product.scentFamily].some(value => has(value, term)));
    }
    if (filters.brand) result = result.filter(product => product.brand === filters.brand);
    if (filters.gender) result = result.filter(product => product.gender === filters.gender);
    if (filters.scentFamily) result = result.filter(product => product.scentFamily.some(family => family.toLowerCase() === filters.scentFamily.toLowerCase()));
    if (filters.size) result = result.filter(product => product.variants.some(variant => String(variant.size) === filters.size));
    if (filters.minRating) result = result.filter(product => product.rating >= Number(filters.minRating));
    if (filters.availability === "in-stock") result = result.filter(product => product.variants.some(variant => variant.stock > 0));
    result = result.filter(product => {
      const prices = product.variants.map(variant => variant.price);
      return (!filters.minPrice || Math.max(...prices) >= Number(filters.minPrice)) && (!filters.maxPrice || Math.min(...prices) <= Number(filters.maxPrice));
    });

    switch (filters.sortBy) {
      case "price-asc": result.sort((a, b) => Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price))); break;
      case "price-desc": result.sort((a, b) => Math.max(...b.variants.map(v => v.price)) - Math.max(...a.variants.map(v => v.price))); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popularity": result.sort((a, b) => b.popularity - a.popularity); break;
      case "newest": result.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / filters.limit));
    const page = Math.min(Math.max(1, filters.page), totalPages);
    return { items: result.slice((page - 1) * filters.limit, page * filters.limit), total, page, limit: filters.limit, totalPages };
  },
  async getProductBySlug(slug: string) { return products.find(product => product.slug === slug); },
  async getSuggestions(term: string) {
    if (!term.trim()) return [];
    return products.filter(product => [product.name, product.brand, ...product.scentFamily, ...product.notes.top, ...product.notes.middle, ...product.notes.base].some(value => has(value, term))).slice(0, 5);
  },
  async getSimilarProducts(product: Product) {
    const notes = [...product.notes.top, ...product.notes.middle, ...product.notes.base].map(note => note.toLowerCase());
    const score = (candidate: Product) => {
      const candidateNotes = [...candidate.notes.top, ...candidate.notes.middle, ...candidate.notes.base].map(note => note.toLowerCase());
      const sharedNotes = notes.filter(note => candidateNotes.includes(note)).length;
      const sharedFamilies = candidate.scentFamily.filter(family => product.scentFamily.includes(family)).length;
      return sharedNotes * 2 + sharedFamilies;
    };
    return products.filter(candidate => candidate.id !== product.id).map(candidate => ({ candidate, score: score(candidate) })).sort((a, b) => b.score - a.score).slice(0, 4).map(entry => entry.candidate);
  }
};
