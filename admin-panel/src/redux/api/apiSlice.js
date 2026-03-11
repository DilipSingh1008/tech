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
      query: (arg) => {
        const endpoint =
          typeof arg === "string" ? arg : (arg?.url || arg?.resource);
        return {
          url: `/${endpoint}`,
          method: "GET",
        };
      },
      providesTags: ["CRUD"],
    }),

    createItem: builder.mutation({
      query: ({ url, data }) => {
        console.log("kk", url);
        console.log(data);

        return {
          url: `/${url}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["CRUD"],
    }),

    updateItem: builder.mutation({
      query: ({ url, data }) => ({
        url: `/${url}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CRUD"],
    }),

    patchItem: builder.mutation({
      query: ({ url, data }) => ({
        url: `/${url}`,
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
    logout: builder.mutation({
      query: () => ({
        url: "admin/logout",
        method: "POST",
      }),
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
  useLogoutMutation,
} = apiSlice;
