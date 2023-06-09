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
    // updateProductInventory: builder.mutation({
    //   query: (purchasedItems) => ({
    //     url: "/products/update-inventory",
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     mode: "cors",
    //     body: purchasedItems,
    //   }),
    //   invalidatesTags: ["Product"],
    // }),
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
    credentialRegister: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/users/credential-register",
        method: "POST",
        body: {
          name: name,
          email: email,
          password: password,
        },
      }),
      invalidatesTags: ["Summary", "User"],
    }),
    googleRegister: builder.mutation({
      query: (initialGoogleCredential) => ({
        url: "/users/google-register",
        method: "POST",
        body: initialGoogleCredential,
      }),
      invalidatesTags: ["Summary", "User"],
    }),
    updateProfile: builder.mutation({
      query: ({ name, email, password, token }) => ({
        url: "/users/update-profile",
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          name: name,
          email: email,
          password: password,
        },
      }),
      invalidatesTags: ["User", "Product", "Review"],
    }),
    deleteAccount: builder.mutation({
      query: ({ id, email, token }) => ({
        url: `/users/delete-account/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          email: email,
        },
      }),
      invalidatesTags: ["Summary", "User", "Product", "Review"],
    }),
    // Orders
    getOrderById: builder.query({
      query: ({ id, token }) => ({
        url: `/orders/order/${id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
      providesTags: ["Order"],
    }),
    getOrderHistory: builder.query({
      query: ({ token }) => ({
        url: "/orders/history",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
      providesTags: ["Summary"],
    }),
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
    updatePaidStatus: builder.mutation({
      query: ({ id, token, orderDetails }) => ({
        url: `/orders/pay/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: orderDetails,
      }),
      invalidatesTags: ["Order", "Summary"],
    }),
    // Admin
    updateDeliveredStatus: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/deliver/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["Order", "Summary"],
    }),
    getAdminSummary: builder.query({
      query: ({ token }) => ({
        url: "/admin/summary",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
      }),
      providesTags: ["Summary"],
    }),
    getAdminOrders: builder.query({
      query: ({ token }) => ({
        url: "/admin/orders",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
      }),
      providesTags: ["Order"],
    }),
    deleteProduct: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
  useUpdateProductInventoryMutation,
  usePostReviewMutation,
  useCredentialLoginMutation,
  useGoogleLoginMutation,
  useCredentialRegisterMutation,
  useGoogleRegisterMutation,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useGetOrderByIdQuery,
  useGetOrderHistoryQuery,
  usePlaceOrderMutation,
  useUpdatePaidStatusMutation,
  useUpdateDeliveredStatusMutation,
  useGetAdminSummaryQuery,
  useGetAdminOrdersQuery,
  useDeleteProductMutation,
} = apiSlice;
