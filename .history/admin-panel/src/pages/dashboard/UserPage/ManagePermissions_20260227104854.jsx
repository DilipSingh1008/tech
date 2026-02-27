import React, { useState, useEffect } from "react";
import { updateItem, getItems, getItemById } from "../../../services/api.js";

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

const emptyPerms = () =>
  modules.reduce((acc, mod) => {
    acc[mod] = { all: false, view: false, edit: false, delete: false };
    return acc;
  }, {});

/**
 * Convert API permissions array → local state object
 * Expected API shape (array of module permission objects):
 * [{ module: "dashboard", view: true, edit: false, delete: false }, ...]
 */
const apiToState = (apiPerms) => {
  const state = emptyPerms();
  if (!Array.isArray(apiPerms)) return state;
  apiPerms.forEach(({ module, view, edit, delete: del }) => {
    if (!state[module]) return;
    state[module].view   = !!view;
    state[module].edit   = !!edit;
    state[module].delete = !!del;
    state[module].all    = !!view && !!edit && !!del;
  });
  return state;
};

/**
 * Convert local state object → API permissions array
 * [{ module: "dashboard", view: true, edit: false, delete: false }, ...]
 */
const stateToApi = (perms) =>
  modules.map((mod) => ({
    module:  mod,
    view:    perms[mod].view,
    edit:    perms[mod].edit,
    delete:  perms[mod].delete,
  }));

// ─── Checkbox ────────────────────────────────────────────────────────────────
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

// ─── Main Component ───────────────────────────────────────────────────────────
const ManagePermissions = () => {
  const [roles, setRoles]               = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [perms, setPerms]               = useState(emptyPerms());
  const [originalPerms, setOriginalPerms] = useState(emptyPerms());

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saveStatus, setSaveStatus]     = useState(null); // "success" | "error" | null
  const [error, setError]               = useState(null);

  // ── Fetch roles on mount ──
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      setError(null);
      try {
        const data = await getItems("roles");
        // Support both { data: [...] } and plain array responses
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setRoles(list);
        if (list.length > 0) setSelectedRole(list[0]._id ?? list[0].id);
      } catch (err) {
        setError("Failed to load roles.");
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // ── Fetch permissions when selectedRole changes ──
  useEffect(() => {
    if (!selectedRole) return;
    const fetchPerms = async () => {
      setLoadingPerms(true);
      setError(null);
      setSaveStatus(null);
      try {
        const data = await getItemById("roles", `${selectedRole}/permissions`);
        const list = Array.isArray(data) ? data : data?.permissions ?? data?.data ?? [];
        const state = apiToState(list);
        setPerms(state);
        setOriginalPerms(state);
      } catch (err) {
        setError("Failed to load permissions for this role.");
        setPerms(emptyPerms());
        setOriginalPerms(emptyPerms());
      } finally {
        setLoadingPerms(false);
      }
    };
    fetchPerms();
  }, [selectedRole]);

  // ── Checkbox handlers ──
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
    setSaveStatus(null);
    if (perm === "all") handleAll(mod, checked);
    else handleSingle(mod, perm, checked);
  };

  // ── Save ──
  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    setSaveStatus(null);
    setError(null);
    try {
      await updateItem(`roles/${selectedRole}/permissions`, {
        permissions: stateToApi(perms),
      });
      setOriginalPerms(perms);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      setSaveStatus("error");
      setError(err?.message ?? "Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  };

  // ── Reset ──
  const handleReset = () => {
    setPerms(originalPerms);
    setSaveStatus(null);
    setError(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 text-gray-200 font-sans min-h-full">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 tracking-tight m-0">
            Manage Permissions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure module-level access control per role
          </p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {/* Role selector */}
          <div className="relative">
            {loadingRoles ? (
              <div className="px-4 py-2 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg">
                Loading roles…
              </div>
            ) : (
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 text-sm text-gray-200 bg-gray-800 border border-gray-600 rounded-lg
                           focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
                           appearance-none pr-8 transition-colors duration-150 hover:border-gray-400"
              >
                {roles.map((role) => (
                  <option
                    key={role._id ?? role.id}
                    value={role._id ?? role.id}
                    className="bg-gray-800"
                  >
                    {role.name ?? role.roleName ?? role.title ?? "Unnamed Role"}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleReset}
            disabled={saving || loadingPerms}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-transparent border border-gray-600
                       rounded-lg hover:border-gray-400 hover:text-gray-200 transition-all duration-150
                       cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={saving || loadingPerms || !selectedRole}
            className={`px-5 py-2 text-sm font-semibold rounded-lg border-none cursor-pointer
                        transition-all duration-300 shadow-md text-white min-w-[140px]
                        disabled:opacity-40 disabled:cursor-not-allowed
                        ${saveStatus === "success"
                          ? "bg-green-700"
                          : saveStatus === "error"
                          ? "bg-red-700"
                          : "bg-blue-600 hover:bg-blue-500"
                        }`}
          >
            {saving
              ? "Saving…"
              : saveStatus === "success"
              ? "✓ Saved!"
              : saveStatus === "error"
              ? "✗ Failed"
              : "Save Permissions"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden shadow-xl bg-gray-900 relative">

        {/* Loading overlay */}
        {(loadingPerms || loadingRoles) && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Loading permissions…
            </div>
          </div>
        )}

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