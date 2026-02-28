import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { updateItem, getItemById, getItems } from "../../../services/api.js";

const PERMISSIONS = ["all", "view", "add", "edit", "delete"];

const permConfig = {
  all:    { checked: "bg-blue-500 border-blue-500",     label: "All" },
  view:   { checked: "bg-green-600 border-green-600",   label: "View" },
  add:    { checked: "bg-purple-500 border-purple-500", label: "Add" },
  edit:   { checked: "bg-amber-600 border-amber-600",   label: "Edit" },
  delete: { checked: "bg-red-500 border-red-500",       label: "Delete" },
};

const legendColors = {
  all:    "bg-blue-500",
  view:   "bg-green-500",
  add:    "bg-purple-500",
  edit:   "bg-amber-500",
  delete: "bg-red-500",
};

// ─── Which fields are allowed on a module ────────────────────────────────────
// If mod.add === false  → add checkbox is permanently disabled (cannot toggle)
// If mod.edit === false → edit checkbox is permanently disabled
// etc.
// Rule: if the field is explicitly false in module config → locked
const isFieldAllowed = (mod, field) => mod[field] !== false;

// ─── State helpers ────────────────────────────────────────────────────────────
const FIELDS = ["view", "add", "edit", "delete"];

const emptyPerms = (modulesList) =>
  modulesList.reduce((acc, mod) => {
    acc[mod._id] = { all: false, view: false, add: false, edit: false, delete: false };
    return acc;
  }, {});

const apiToState = (apiPermissions, modulesList) => {
  const state = emptyPerms(modulesList);
  apiPermissions.forEach((p) => {
    const modId = p.module?._id || p.module;
    if (!state[modId]) return;
    state[modId].view   = !!p.view;
    state[modId].add    = !!p.add;
    state[modId].edit   = !!p.edit;
    state[modId].delete = !!p.delete;
    state[modId].all    = !!p.all;
  });
  return state;
};
const isNotApplicable = (mod, perm) => {
  if (perm === "all") return false;
  return mod[perm] === false;
};

const stateToApi = (perms) =>
  Object.keys(perms).map((moduleId) => ({
    module: moduleId,
    ...perms[moduleId],
  }));

// Recalculate "all": true only when every ALLOWED field is checked
// Fields that are disabled (mod[field]===false) are skipped from the check
const recalcAll = (mod, current) => {
  return FIELDS.every((f) => {
    if (!isFieldAllowed(mod, f)) return true; // skip disabled fields
    return !!current[f];
  });
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange, perm, disabled }) => (
  <label
    className={`inline-flex items-center justify-center
      ${disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => !disabled && onChange(e.target.checked)}
      disabled={disabled}
      className="sr-only"
    />
    <span
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
        transition-all duration-150
        ${
          disabled
            ? "bg-gray-800 border-gray-700"
            : checked
            ? `${permConfig[perm].checked} shadow-md`
            : "bg-gray-700 border-gray-600 hover:border-gray-400"
        }`}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke={disabled ? "#4b5563" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  </label>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
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
  const { id: roleId } = useParams();

  const [roleName, setRoleName]           = useState("");
  const [perms, setPerms]                 = useState({});
  const [originalPerms, setOriginalPerms] = useState({});
  const [modules, setModules]             = useState([]);
  const [loadingPerms, setLoadingPerms]   = useState(false);
  const [saving, setSaving]               = useState(false);
  const [saveStatus, setSaveStatus]       = useState(null);
  const [errorMsg, setErrorMsg]           = useState(null);

  // ── Fetch modules ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await getItems("role/module");
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

  // ── Fetch role permissions ────────────────────────────────────────────────
  useEffect(() => {
    if (!roleId || modules.length === 0) return;
    const fetchPerms = async () => {
      setLoadingPerms(true);
      setErrorMsg(null);
      setSaveStatus(null);
      try {
        const res   = await getItemById("role", `${roleId}/permissions`);
        setRoleName(res?.name ?? "");
        const list  = res?.permissions ?? [];
        const state = apiToState(list, modules);
        setPerms(state);
        setOriginalPerms(state);
      } catch {
        setErrorMsg("Failed to load permissions for this role.");
        setPerms(emptyPerms(modules));
        setOriginalPerms(emptyPerms(modules));
      } finally {
        setLoadingPerms(false);
      }
    };
    fetchPerms();
  }, [roleId, modules]);

  // ── Disabled logic ────────────────────────────────────────────────────────
  //
  //  Rule 1: if mod[perm] === false → PERMANENTLY disabled (cannot click at all)
  //          e.g. dashboard.add=false, dashboard.delete=false
  //               settings.add=false,  settings.delete=false
  //
  //  Rule 2: if perm is add/edit/delete AND view is currently OFF → disabled
  //          (can't give actions without view access)
  //
  //  "all" is never disabled — it controls only the allowed fields
  //

  const isDisabled = (mod, perm) => {
    if (perm === "all") return false;

    // Rule 1: mod config has this field=false → permanently disabled
    // e.g. dashboard.add=false, dashboard.delete=false, settings.add=false
    if (!isFieldAllowed(mod, perm)) return true;

    // Rule 2: add/edit/delete need view to be ON
    // Only apply after perms are loaded (loadingPerms=false)
    // AND only if view is explicitly false in the current perms state
    if (perm !== "view" && !loadingPerms) {
      const viewState = perms[mod._id]?.view ?? isFieldAllowed(mod, "view");
      if (!viewState) return true;
    }

    return false;
  };

  // ── Handle "All" checkbox ─────────────────────────────────────────────────
  // When checked: enable ONLY fields where mod[field] !== false
  // When unchecked: turn off all fields (regardless of restrictions)
  const handleAll = (mod, checked) => {
    setSaveStatus(null);
    setPerms((prev) => ({
      ...prev,
      [mod._id]: {
        all:    checked,
        view:   checked && isFieldAllowed(mod, "view"),
        add:    checked && isFieldAllowed(mod, "add"),
        edit:   checked && isFieldAllowed(mod, "edit"),
        delete: checked && isFieldAllowed(mod, "delete"),
      },
    }));
  };

  // ── Handle single checkbox ────────────────────────────────────────────────
  const handleSingle = (mod, perm, checked) => {
    setSaveStatus(null);
    setPerms((prev) => {
      const current = { ...prev[mod._id], [perm]: checked };

      // Unchecking view → clear add/edit/delete too
      if (perm === "view" && !checked) {
        current.add    = false;
        current.edit   = false;
        current.delete = false;
      }

      // Checking add/edit/delete → auto-enable view (if view is allowed)
      if (perm !== "view" && checked && !current.view && isFieldAllowed(mod, "view")) {
        current.view = true;
      }

      // Recalculate "all" — skip disabled fields from the check
      current.all = recalcAll(mod, current);

      return { ...prev, [mod._id]: current };
    });
  };

  const handleChange = (mod, perm, checked) => {
    if (perm === "all") handleAll(mod, checked);
    else handleSingle(mod, perm, checked);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
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

  // ── Reset ─────────────────────────────────────────────────────────────────
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
              {PERMISSIONS.map((perm) => (
  <td key={perm} className="py-3.5 px-4 text-center">
    <div className="flex items-center justify-center">

      {isNotApplicable(mod, perm) ? (
  <span className="text-xs text-gray-500">N/A</span>
) : (
  <Checkbox
    checked={perms[mod._id]?.[perm] || false}
    onChange={(checked) => handleChange(mod, perm, checked)}
    perm={perm}
    disabled={isDisabled(mod, perm)}
  />
)}

    </div>
  </td>
))}
            </tr>
          </thead>

          <tbody>
            {modules.map((mod, idx) => {
              // Show "restricted" badge if any field is locked on this module
              const isRestricted = FIELDS.some((f) => !isFieldAllowed(mod, f));

              return (
                <tr
                  key={mod._id}
                  className={`border-b border-gray-700/50 transition-colors duration-150
                              hover:bg-blue-900/10
                              ${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}`}
                >
                  {/* Module name */}
                  <td className="pl-6 pr-4 py-3.5 text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                      {mod.label}
                      {isRestricted && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                                         bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          restricted
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Permission checkboxes */}
                  {PERMISSIONS.map((perm) => (
                    <td key={perm} className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={perms[mod._id]?.[perm] || false}
                          onChange={(checked) => handleChange(mod, perm, checked)}
                          perm={perm}
                          disabled={isDisabled(mod, perm)}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-5 mt-4 pl-1 items-center">
        {PERMISSIONS.map((perm) => (
          <div key={perm} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${legendColors[perm]}`} />
            <span className="text-xs text-gray-500">{permConfig[perm].label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-800 border border-gray-700 opacity-60" />
          <span className="text-xs text-gray-600">Disabled / Restricted</span>
        </div>
      </div>
    </div>
  );
};

export default ManagePermissions;