import React, { useState } from "react";
import {updateItem, getItems} from "../../../services/api.js"

const modules = [
  "dashboard",
  "users",
  "location",
  "categories",
  "banner",
  "products",
  "services",
  "cms",
  "faq",
  "settings",
];

const PERMISSIONS = ["all", "view", "edit", "delete"];

const permConfig = {
  all:    { checked: "bg-blue-500 border-blue-500 shadow-blue-500/40",    label: "All" },
  view:   { checked: "bg-green-600 border-green-600 shadow-green-600/40", label: "View" },
  edit:   { checked: "bg-amber-600 border-amber-600 shadow-amber-600/40", label: "Edit" },
  delete: { checked: "bg-red-500 border-red-500 shadow-red-500/40",       label: "Delete" },
};

const legendColors = {
  all:    "bg-blue-500",
  view:   "bg-green-500",
  edit:   "bg-amber-500",
  delete: "bg-red-500",
};

const initialState = () =>
  modules.reduce((acc, mod) => {
    acc[mod] = { all: false, view: false, edit: false, delete: false };
    return acc;
  }, {});

const Checkbox = ({ checked, onChange, perm }) => {
  const config = permConfig[perm];
  return (
    <label className="inline-flex items-center justify-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 shadow-sm
          ${checked ? `${config.checked} shadow-md` : "bg-gray-700 border-gray-600"}`}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  );
};

const ManagePermissions = () => {
  const [perms, setPerms] = useState(initialState());
  const [saved, setSaved] = useState(false);

  const handleAll = (mod, checked) => {
    setPerms((prev) => ({
      ...prev,
      [mod]: { all: checked, view: checked, edit: checked, delete: checked },
    }));
  };

  const handleSingle = (mod, perm, checked) => {
    setPerms((prev) => {
      const updated = { ...prev[mod], [perm]: checked };
      updated.all = updated.view && updated.edit && updated.delete;
      return { ...prev, [mod]: updated };
    });
  };

  const handleChange = (mod, perm, checked) => {
    setSaved(false);
    if (perm === "all") handleAll(mod, checked);
    else handleSingle(mod, perm, checked);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setPerms(initialState());
    setSaved(false);
  };

  return (
    <div className="p-6 text-gray-200 font-sans min-h-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-7">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 tracking-tight m-0">
            Manage Permissions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure module-level access control for roles
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-transparent border border-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-200 transition-all duration-150 cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className={`px-5 py-2 text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-300 shadow-md text-white
              ${
                saved
                  ? "bg-green-800 shadow-green-900/40"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-700/40"
              }`}
          >
            {saved ? "✓ Saved!" : "Save Permissions"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden shadow-xl bg-gray-900">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="text-left pl-6 pr-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-700 w-2/5">
                Module
              </th>
              {PERMISSIONS.map((p) => (
                <th
                  key={p}
                  className="py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-700"
                >
                  {permConfig[p].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, idx) => (
              <tr
                key={mod}
                className={`border-b border-gray-700/50 transition-colors duration-150 hover:bg-blue-900/10
                  ${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}`}
              >
                <td className="pl-6 pr-4 py-3.5 text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                    {mod.charAt(0).toUpperCase() + mod.slice(1)}
                  </div>
                </td>
                {PERMISSIONS.map((perm) => (
                  <td key={perm} className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={perms[mod][perm]}
                        onChange={(checked) => handleChange(mod, perm, checked)}
                        perm={perm}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 mt-4 pl-1">
        {PERMISSIONS.map((perm) => (
          <div key={perm} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${legendColors[perm]}`} />
            <span className="text-xs text-gray-500">{permConfig[perm].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePermissions;