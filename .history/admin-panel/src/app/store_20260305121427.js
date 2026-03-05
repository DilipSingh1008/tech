import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../redux/api/apiSlice";
import permissionReducer from "../redux/store/permissionSlice";

export const store = configureStore({
  reducer: {
    permission: permissionReducer, // ⭐ ye missing tha
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});