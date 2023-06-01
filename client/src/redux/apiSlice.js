import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api`,
  }),
  tagTypes: ["Product", "Order", "Summary", "User", "Review"],
  endpoints: (builder) => ({
    // Products
    getAllProducts: builder.query({
      query: (page) => `/products/pagination/${page}`,
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/product/${slug}`,
      providesTags: ["Product", "Review"],
    }),
    postReview: builder.mutation({
      query: ({ id, token, content, rating }) => ({
        url: `/products/reviews/${id}`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          content: content,
          rating: rating,
        },
      }),
      invalidatesTags: ["Product", "Review"],
    }),

    // Users
    credentialLogin: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/credential-login",
        method: "POST",
        // body: initialUserCredentials, same as object below..
        body: {
          email: email,
          password: password,
        },
      }),
    }),
    googleLogin: builder.mutation({
      query: (initialGoogleCredential) => ({
        url: "/users/google-login",
        method: "POST",
        body: initialGoogleCredential,
      }),
    }),
    // Orders
    placeOrder: builder.mutation({
      query: (initialOrder) => ({
        url: "/orders/place-order",
        method: "POST",
        headers: {
          Authorization: "Bearer " + initialOrder.token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: initialOrder,
      }),
      invalidatesTags: ["Summary"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
  usePostReviewMutation,
  useCredentialLoginMutation,
  useGoogleLoginMutation,
  usePlaceOrderMutation,
} = apiSlice;
