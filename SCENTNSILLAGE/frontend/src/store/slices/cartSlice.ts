import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartLine {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartLine>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.isOpen = true;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, setCartOpen, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
