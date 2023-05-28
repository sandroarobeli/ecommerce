import { configureStore } from "@reduxjs/toolkit";

// import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import pageSlice from "./pageSlice";
import { apiSlice } from "./apiSlice";

const store = configureStore({
  reducer: {
    // user: userReducer,
    cart: cartReducer,
    product: productReducer,
    page: pageSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
