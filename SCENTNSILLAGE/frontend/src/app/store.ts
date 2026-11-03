import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CART_STORAGE_KEY } from "@/store/slices/cartSlice";
import wishlistReducer from "@/store/slices/wishlistSlice";
import uiReducer from "@/store/slices/uiSlice";

export const store = configureStore({
  reducer: { cart: cartReducer, wishlist: wishlistReducer, ui: uiReducer }
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
    localStorage.setItem("scentnsillage-wishlist", JSON.stringify(state.wishlist.items));
  } catch { /* Storage may be unavailable in private browsing. */ }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
