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
      providesTags: ["Product"],
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
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
  useCredentialLoginMutation,
  useGoogleLoginMutation,
} = apiSlice;
