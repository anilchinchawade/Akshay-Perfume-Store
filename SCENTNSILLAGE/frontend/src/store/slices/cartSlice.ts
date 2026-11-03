import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartLine {
  id: string;
  productId: string;
  slug?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
}

interface CartState { items: CartLine[]; isOpen: boolean; }
const STORAGE_KEY = "scentnsillage-cart";

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as CartLine[] : [];
  } catch { return []; }
}

const initialState: CartState = { items: readCart(), isOpen: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartLine>) {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock ?? 99);
      else state.items.push(action.payload);
      state.isOpen = true;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(line => line.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock ?? 99));
      }
    },
    setCartOpen(state, action: PayloadAction<boolean>) { state.isOpen = action.payload; },
    clearCart(state) { state.items = []; }
  }
});

export const { addItem, removeItem, setQuantity, setCartOpen, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export const CART_STORAGE_KEY = STORAGE_KEY;
