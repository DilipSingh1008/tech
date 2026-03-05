import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    roleId: null,
    roleName: null,
    permissions: [],
  },

  reducers: {
    clearPermissions: (state) => {
      state.permissions = [];
      state.roleId = null;
      state.roleName = null;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.getItems.matchFulfilled,
      (state, action) => {

        const roleId = localStorage.getItem("roleId");
        const role = localStorage.getItem("role");

        if (!roleId) return;

        // admin case
        if (role === "admin") {
          state.roleId = roleId;
          state.roleName = role;
          state.permissions = [];
          return;
        }

        // permissions endpoint detect
        if (action.meta.arg.originalArgs?.includes("permissions")) {
          state.roleId = roleId;
          state.roleName = action.payload?.name;
          state.permissions = action.payload?.permissions || [];
        }
      }
    );
  },
});

export const { clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;