import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  mobileMenuOpen: boolean;
}

const initialState: UiState = { mobileMenuOpen: false };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    }
  }
});

export const { setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
