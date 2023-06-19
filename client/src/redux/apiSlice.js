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
      query: ({ page }) => `/products/pagination/${page}`,
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query({
      query: ({ slug }) => `/products/product/${slug}`,
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
          "Content-Type": "application/json",
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
          "Content-Type": "application/json",
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
    getAllUsers: builder.query({
      query: ({ token }) => ({
        url: "/admin/users",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, token, isAdmin }) => ({
        url: `/admin/user/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          isAdmin: isAdmin,
        },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["User", "Product", "Review"],
    }),
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
    getCloudinarySignature: builder.query({
      query: ({ token }) => ({
        url: "/admin/cloudinary-signature",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
      }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        method: "POST",
        mode: "cors",
        body: formData,
      }),
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
      providesTags: ["Product", "Summary"],
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
    createProduct: builder.mutation({
      query: ({
        token,
        name,
        slug,
        category,
        image,
        price,
        brand,
        inStock,
        description,
      }) => ({
        url: "/admin/new-product",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          name: name,
          slug: slug,
          category: category,
          image: image,
          price: price,
          brand: brand,
          inStock: inStock,
          description: description,
        },
      }),
      invalidatesTags: ["Product", "Summary"],
    }),
    updateProduct: builder.mutation({
      query: ({
        id,
        token,
        name,
        slug,
        price,
        image,
        category,
        brand,
        inStock,
        description,
      }) => ({
        url: `/admin/product/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          name: name,
          slug: slug,
          price: price,
          image: image,
          category: category,
          brand: brand,
          inStock: inStock,
          description: description,
        },
      }),
      invalidatesTags: ["Product"],
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
      invalidatesTags: ["Product", "Summary"],
    }),
    deleteOrder: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/order/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["Order", "Summary"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
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
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateDeliveredStatusMutation,
  useGetCloudinarySignatureQuery,
  useUploadImageMutation,
  useGetAdminSummaryQuery,
  useGetAdminOrdersQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteOrderMutation,
} = apiSlice;
