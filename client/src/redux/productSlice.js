import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearProductError: (state, action) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.getAllProducts.matchFulfilled,
        (state, action) => {
          state.products = action.payload;
        }
      )
      .addMatcher(
        apiSlice.endpoints.getAllProducts.matchRejected,
        (state, action) => {
          state.error = action.payload.data.message;
          console.log("error", state.error); // test
        }
      );
  },
});

// Exports reducer functions
export const { clearProductError } = productSlice.actions;

// Exports individual selectors
// None for now.. Add one for individual product if it's needed elsewhere to save on api call!
export default productSlice.reducer;
