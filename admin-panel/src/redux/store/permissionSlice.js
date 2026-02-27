// store/permissionSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getItems } from "../../services/api";

const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    roleId: null,
    roleName: null,
    permissions: [],
  },
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload.permissions;
      state.roleId = action.payload.roleId;
      state.roleName = action.payload.roleName
    },
    clearPermissions: (state) => {
      state.permissions = [];
      state.roleId = null;
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;

export const fetchPermissions = () => async (dispatch) => {
  try {
    const roleId = localStorage.getItem("roleId");   // ⭐ yaha se

    console.log("xxxxxxxxxxx", roleId)

    if (!roleId) return;

    const permRes = await getItems(`role/${roleId}/permissions`);

    console.log("yyyyyyyyyyyy", permRes)

    dispatch(
      setPermissions({
        roleId,
        roleName: permRes.name,
        permissions: permRes.permissions,
      })
    );
  } catch (err) {
    console.log(err);
  }
};