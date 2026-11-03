import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}
const KEY = "scentnsillage-wishlist";
function readWishlist(): WishlistItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as WishlistItem[]; }
  catch { return []; }
}
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: readWishlist() },
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some(item => item.productId === action.payload.productId);
      state.items = exists ? state.items.filter(item => item.productId !== action.payload.productId) : [...state.items, action.payload];
    },
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.productId !== action.payload);
    }
  }
});
export const { toggleWishlist, removeWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
