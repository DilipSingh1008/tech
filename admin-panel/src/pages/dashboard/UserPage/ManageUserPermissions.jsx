import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useUpdateItemMutation,
} from "../../../redux/api/apiSlice";

const PERMISSIONS = ["all", "view", "add", "edit", "delete"];
const FIELDS = ["view", "add", "edit", "delete"];

const isFieldAllowed = (mod, field) => mod[field] !== false;

const emptyPerms = (modulesList) =>
  modulesList.reduce((acc, mod) => {
    acc[mod._id] = { all: false, view: false, add: false, edit: false, delete: false };
    return acc;
  }, {});

const apiToState = (apiPermissions, modulesList) => {
  const state = emptyPerms(modulesList);
  (apiPermissions || []).forEach((p) => {
    const modId = p.module?._id || p.module;
    if (!state[modId]) return;
    state[modId] = {
      all: !!p.all,
      view: !!p.view,
      add: !!p.add,
      edit: !!p.edit,
      delete: !!p.delete,
    };
  });
  return state;
};

const stateToApi = (perms) =>
  Object.keys(perms).map((moduleId) => ({ module: moduleId, ...perms[moduleId] }));

const ManageUserPermissions = () => {
  const { id: userId } = useParams();
  const [perms, setPerms] = useState({});

  const { data: modulesData, isLoading: loadingModules } = useGetItemsQuery("role/module");
  const modules = modulesData || [];

  const { data: userPermData, isLoading: loadingUser } = useGetItemByIdQuery({
    resource: `user/${userId}/permissions`,
  }, { skip: !userId });

  const [updateItem, { isLoading: saving }] = useUpdateItemMutation();

  useEffect(() => {
    if (!modules.length) return;
    setPerms(apiToState(userPermData?.permissions, modules));
  }, [modules, userPermData]);

  const handleChange = (mod, perm, checked) => {
    setPerms((prev) => {
      const current = { ...prev[mod._id] };
      if (perm === "all") {
        const next = {
          all: checked,
          view: checked && isFieldAllowed(mod, "view"),
          add: checked && isFieldAllowed(mod, "add"),
          edit: checked && isFieldAllowed(mod, "edit"),
          delete: checked && isFieldAllowed(mod, "delete"),
        };
        return { ...prev, [mod._id]: next };
      }
      current[perm] = checked;
      if (perm === "view" && !checked) {
        current.add = false;
        current.edit = false;
        current.delete = false;
      }
      if (perm !== "view" && checked && !current.view && isFieldAllowed(mod, "view")) {
        current.view = true;
      }
      current.all = FIELDS.every((f) => !isFieldAllowed(mod, f) || current[f]);
      return { ...prev, [mod._id]: current };
    });
  };

  const handleSave = async () => {
    await updateItem({
      url: `user/${userId}/permissions`,
      data: { permissions: stateToApi(perms) },
    }).unwrap();
  };

  const isLoading = loadingModules || loadingUser;

  return (
    <div className="p-6 text-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">User Specific Permissions</h2>
          <p className="text-sm text-gray-400">
            Extra permissions for user: <span className="font-medium">{userPermData?.name || "-"}</span>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || isLoading}
          className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save User Permissions"}
        </button>
      </div>

      <div className="rounded-xl border border-gray-700 overflow-hidden bg-gray-900">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Module</th>
              {PERMISSIONS.map((p) => (
                <th key={p} className="text-center px-4 py-3 text-xs uppercase tracking-wider text-gray-400">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-4 text-sm text-gray-400">Loading...</td></tr>
            )}
            {!isLoading &&
              modules.map((mod) => (
                <tr key={mod._id} className="border-t border-gray-800">
                  <td className="px-4 py-3 text-sm">{mod.label}</td>
                  {PERMISSIONS.map((perm) => {
                    const disabled = perm !== "all" && mod[perm] === false;
                    return (
                      <td key={perm} className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={!!perms?.[mod._id]?.[perm]}
                          disabled={disabled}
                          onChange={(e) => handleChange(mod, perm, e.target.checked)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUserPermissions;
