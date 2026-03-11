// src/redux/permissionSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const initialState = {
  roleId: localStorage.getItem("roleId") || null,
  roleName: localStorage.getItem("role") || null,
  permissions: [],
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    // Clear permissions on logout
    clearPermissions: (state) => {
      state.roleId = null;
      state.roleName = null;
      state.permissions = [];
    },

    // Set permissions on login
    setPermissions: (state, action) => {
      state.roleId = action.payload.roleId;
      state.roleName = action.payload.roleName;
      state.permissions = action.payload.permissions || [];
    },
  },

  extraReducers: (builder) => {
    // Optional: handle permissions from API fetches
    builder.addMatcher(
      apiSlice.endpoints.getItems.matchFulfilled,
      (state, action) => {
        const roleId = localStorage.getItem("roleId");
        const role = localStorage.getItem("role");

        if (!roleId) return;

        // Admin: full access
        if (role === "admin") {
          state.roleId = roleId;
          state.roleName = role;
          state.permissions = [];
          return;
        }

        // Permissions endpoint: update from API
        if (action.meta.arg.originalArgs?.includes("permissions")) {
          state.roleId = roleId;
          state.roleName = action.payload?.name;
          state.permissions = action.payload?.permissions || [];
        }
      },
    );
  },
});

// Export actions
export const { clearPermissions, setPermissions } = permissionSlice.actions;

// Export reducer
export default permissionSlice.reducer;
