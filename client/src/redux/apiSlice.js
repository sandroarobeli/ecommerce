import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api`,
  }),
  tagTypes: ["Product", "Order", "Summary", "User", "Review"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (page) => `/products/pagination/${page}`,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetAllProductsQuery } = apiSlice;
