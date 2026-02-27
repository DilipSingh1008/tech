import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { updateItem, getItemById } from "../../../services/api.js";

// const modules = [
//   "dashboard",
//   "users",
//   "location",
//   "categories",
//   "banner",
//   "products",
//   "services",
//   "cms",
//   "faq",
//   "settings",
// ];

const PERMISSIONS = ["all", "view", "add", "edit", "delete"];

const permConfig = {
  all:    { checked: "bg-blue-500 border-blue-500",    label: "All" },
  view:   { checked: "bg-green-600 border-green-600",  label: "View" },
  add:    { checked: "bg-purple-500 border-purple-500",label: "Add" },
  edit:   { checked: "bg-amber-600 border-amber-600",  label: "Edit" },
  delete: { checked: "bg-red-500 border-red-500",      label: "Delete" },
};

const legendColors = {
  all:    "bg-blue-500",
  view:   "bg-green-500",
  add:    "bg-purple-500",
  edit:   "bg-amber-500",
  delete: "bg-red-500",
};

const emptyPerms = (modulesList) =>
  modulesList.reduce((acc, mod) => {
    acc[mod.name] = {
      all: false,
      view: false,
      add: false,
      edit: false,
      delete: false,
    };
    return acc;
  }, {});

// API response → local state
const apiToState = (apiPermissions) => {
  const state = emptyPerms(modules);

  console.log("state = ", state)
  console.log(Array.isArray(apiPermissions))
  if (!Array.isArray(apiPermissions)) return state;
  apiPermissions.forEach((p) => {
    const mod = p.module;
    if (!state[mod]) return;
    state[mod].view   = !!p.view;
    state[mod].add    = !!p.add;
    state[mod].edit   = !!p.edit;
    state[mod].delete = !!p.delete;
    state[mod].all    = !!p.all || (!!p.view && !!p.add && !!p.edit && !!p.delete);
  });
  return state;
};

// Local state → API payload
const stateToApi = (perms) =>
  modules.map((mod) => ({
    module: mod,
    all:    perms[mod].all,
    view:   perms[mod].view,
    add:    perms[mod].add,
    edit:   perms[mod].edit,
    delete: perms[mod].delete,
  }));

// ─── Checkbox ────────────────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange, perm }) => (
  <label className="inline-flex items-center justify-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <span
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
        transition-all duration-150
        ${checked
          ? `${permConfig[perm].checked} shadow-md`
          : "bg-gray-700 border-gray-600"
        }`}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  </label>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ManagePermissions = () => {
  // ✅ Role ID comes from the route: /dashboard/manage-permission/:id
  const { id: roleId } = useParams();

  const [roleName, setRoleName]           = useState("");
  const [perms, setPerms]                 = useState(emptyPerms());
  const [originalPerms, setOriginalPerms] = useState(emptyPerms());
  const [modules, setModules] = useState([]);
  const [loadingPerms, setLoadingPerms]   = useState(false);
  const [saving, setSaving]               = useState(false);
  const [saveStatus, setSaveStatus]       = useState(null); // "success" | "error" | null
  const [errorMsg, setErrorMsg]           = useState(null);

  // ── Fetch permissions on mount / when roleId changes ─────────────────────
  useEffect(() => {
    if (!roleId) return;
    const fetchPerms = async () => {
      setLoadingPerms(true);
      setErrorMsg(null);
      setSaveStatus(null);
      try {
        // GET /role/:id/permissions → { name, permissions: [...] }
        const res   = await getItemById("role", `${roleId}/permissions`);
        setRoleName(res?.name ?? "");
        const list  = res?.permissions ?? [];
        const state = apiToState(list);
        setPerms(state);
        setOriginalPerms(state);
      } catch {
        setErrorMsg("Failed to load permissions for this role.");
        setPerms(emptyPerms());
        setOriginalPerms(emptyPerms());
      } finally {
        setLoadingPerms(false);
      }
    };
    fetchPerms();
  }, [roleId]);

  useEffect(() => {
  const fetchModules = async () => {
    try {
      const res = await getItemById("module"); // GET /module
      setModules(res || []);
    } catch (err) {
      console.error("Failed to load modules", err);
    }
  };

  fetchModules();
}, []);

useEffect(() => {
  if (modules.length > 0) {
    const initial = emptyPerms(modules);
    setPerms(initial);
    setOriginalPerms(initial);
  }
}, [modules]);

  // ── Checkbox handlers ─────────────────────────────────────────────────────
  const handleAll = (mod, checked) => {
    setSaveStatus(null);
    setPerms((prev) => ({
      ...prev,
      [mod]: { all: checked, view: checked, add: checked, edit: checked, delete: checked },
    }));
  };

  const handleSingle = (mod, perm, checked) => {
    setSaveStatus(null);
    setPerms((prev) => {
      const updated = { ...prev[mod], [perm]: checked };
      updated.all = updated.view && updated.add && updated.edit && updated.delete;
      return { ...prev, [mod]: updated };
    });
  };

  const handleChange = (mod, perm, checked) => {
    if (perm === "all") handleAll(mod, checked);
    else handleSingle(mod, perm, checked);
  };

  // ── Save → PUT /role/:id/permissions ─────────────────────────────────────
  const handleSave = async () => {
    if (!roleId) return;
    setSaving(true);
    setSaveStatus(null);
    setErrorMsg(null);
    try {
      await updateItem(`role/${roleId}/permissions`, {
        permissions: stateToApi(perms),
      });
      setOriginalPerms(perms);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      setSaveStatus("error");
      setErrorMsg(err?.message ?? "Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  };

  // ── Reset → restore last saved/fetched state ──────────────────────────────
  const handleReset = () => {
    setPerms(originalPerms);
    setSaveStatus(null);
    setErrorMsg(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 text-gray-200 font-sans min-h-full">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 tracking-tight m-0">
            Manage Permissions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure module-level access control per role
            {roleName && (
              <span className="ml-1.5 text-gray-400 capitalize font-medium">
                — {roleName}
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {/* Reset */}
          <button
            onClick={handleReset}
            disabled={saving || loadingPerms}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-transparent
                       border border-gray-600 rounded-lg hover:border-gray-400
                       hover:text-gray-200 transition-all duration-150 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || loadingPerms || !roleId}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg
                        border-none cursor-pointer transition-all duration-300 shadow-md
                        text-white min-w-[150px] justify-center
                        disabled:opacity-40 disabled:cursor-not-allowed
                        ${saveStatus === "success" ? "bg-green-700"
                          : saveStatus === "error"  ? "bg-red-700"
                          : "bg-blue-600 hover:bg-blue-500"}`}
          >
            {saving && <Spinner />}
            {saving
              ? "Saving…"
              : saveStatus === "success" ? "✓ Saved!"
              : saveStatus === "error"   ? "✗ Failed"
              : "Save Permissions"}
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {errorMsg && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700/50
                        text-red-400 text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-700 overflow-hidden shadow-xl bg-gray-900 relative">

        {/* Loading overlay */}
        {loadingPerms && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Spinner /> Loading permissions…
            </div>
          </div>
        )}

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="text-left pl-6 pr-4 py-3.5 text-xs font-semibold uppercase
                             tracking-widest text-gray-500 border-b border-gray-700 w-1/3">
                Module
                {roleName && (
                  <span className="ml-2 normal-case font-normal text-gray-600 capitalize">
                    — {roleName}
                  </span>
                )}
              </th>
              {PERMISSIONS.map((p) => (
                <th key={p}
                  className="py-3.5 px-4 text-center text-xs font-semibold uppercase
                             tracking-widest text-gray-500 border-b border-gray-700">
                  {permConfig[p].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, idx) => (
              <tr key={mod}
                className={`border-b border-gray-700/50 transition-colors duration-150
                            hover:bg-blue-900/10
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

      {/* ── Legend ── */}
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