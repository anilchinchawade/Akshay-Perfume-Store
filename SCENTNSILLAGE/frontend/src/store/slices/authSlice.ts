import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
}
interface AuthState {
  user: Customer | null;
  status: "unknown" | "authenticated" | "guest";
}
const initialState: AuthState = { user: null, status: "unknown" };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<Customer>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    setGuest(state) {
      state.user = null;
      state.status = "guest";
    },
    updateCustomer(state, action: PayloadAction<Partial<Customer>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    }
  }
});
export const { setAuthenticated, setGuest, updateCustomer } = authSlice.actions;
export default authSlice.reducer;
