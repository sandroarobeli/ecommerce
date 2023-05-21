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
          console.log("current products", state.products); // test
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
// export const selectProductBySlug = (state, slug) =>
//   state.product.products.find((item) => item.slug === slug);

export default productSlice.reducer;
