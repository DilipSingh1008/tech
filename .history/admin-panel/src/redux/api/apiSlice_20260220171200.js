import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["CRUD"],
  endpoints: (builder) => ({
    getData: builder.query({
      query: ({ url, params }) => ({
        url,
        params,
      }),
      providesTags: ["CRUD"],
    }),

    postData: builder.mutation({
      query: ({ url, body }) => ({
        url,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CRUD"],
    }),

    updateData: builder.mutation({
      query: ({ url, body }) => ({
        url,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CRUD"],
    }),

    deleteData: builder.mutation({
      query: ({ url }) => ({
        url,
        method: "DELETE",
      }),
      invalidatesTags: ["CRUD"],
    }),
  }),
});

export const {
  useGetDataQuery,
  usePostDataMutation,
  useUpdateDataMutation,
  useDeleteDataMutation,
} = apiSlice;