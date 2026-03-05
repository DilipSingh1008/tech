import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["CRUD"],
  endpoints: (builder) => ({
    
    getItems: builder.query({
      query: (resource) => ({
        url: `/${resource}`,
        method: "GET",
      }),
      providesTags: ["CRUD"],
    }),

    getItemById: builder.query({
      query: ({ resource, id }) => ({
        url: `/${resource}/${id}`,
        method: "GET",
      }),
      providesTags: ["CRUD"],
    }),

    createItem: builder.mutation({
      query: ({ resource, data }) => ({
        url: `/${resource}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CRUD"],
    }),

    updateItem: builder.mutation({
      query: ({ resource, data }) => ({
        url: `/${resource}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CRUD"],
    }),

    patchItem: builder.mutation({
      query: ({ resource, data }) => ({
        url: `/${resource}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CRUD"],
    }),

    deleteItem: builder.mutation({
      query: (resource) => ({
        url: `/${resource}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CRUD"],
    }),

  }),
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  usePatchItemMutation,
  useDeleteItemMutation,
} = apiSlice;