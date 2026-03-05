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
    let role = localStorage.getItem("role"); 

    console.log("xxxxxxxxxxx", roleId)

    if (!roleId) return;
      let permRes;
console.log("kooo")


    if(role !== "admin"){
      console.log("jii")
       permRes = await getItems(`role/${roleId}/permissions`);
    }

    console.log("permRes", permRes)

    if(role !== "admin"){
      console.log("00000000000")
      dispatch(
      setPermissions({
        roleId: roleId,
        roleName: permRes.name,
        permissions: permRes.permissions || [],
      })
    );
    }else{
      dispatch(
      setPermissions({
        roleId: roleId,
        roleName: role,
        
      }))
    }
  } catch (err) {
    console.log(err);
  }
};