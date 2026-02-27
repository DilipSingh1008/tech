import React, { useState } from "react";

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

const initialState = () =>
  modules.reduce((acc, mod) => {
    acc[mod] = { all: false, view: false, edit: false, delete: false };
    return acc;
  }, {});

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
      const allChecked = updated.view && updated.edit && updated.delete;
      updated.all = allChecked;
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
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Manage Permissions</h2>
          <p style={styles.subtitle}>
            Configure module-level access control for roles
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
          <button
            style={{ ...styles.saveBtn, ...(saved ? styles.saveBtnSuccess : {}) }}
            onClick={handleSave}
          >
            {saved ? "✓ Saved!" : "Save Permissions"}
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.thModule }}>Module</th>
              {PERMISSIONS.map((p) => (
                <th key={p} style={styles.th}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, idx) => (
              <tr
                key={mod}
                style={{
                  ...styles.tr,
                  background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(99,179,237,0.07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent")
                }
              >
                <td style={styles.tdModule}>
                  <span style={styles.moduleDot} />
                  {mod.charAt(0).toUpperCase() + mod.slice(1)}
                </td>
                {PERMISSIONS.map((perm) => (
                  <td key={perm} style={styles.td}>
                    <label style={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={perms[mod][perm]}
                        onChange={(e) =>
                          handleChange(mod, perm, e.target.checked)
                        }
                        style={styles.hiddenCheck}
                      />
                      <span
                        style={{
                          ...styles.customCheck,
                          ...(perms[mod][perm]
                            ? perm === "all"
                              ? styles.checkAll
                              : perm === "view"
                              ? styles.checkView
                              : perm === "edit"
                              ? styles.checkEdit
                              : styles.checkDelete
                            : {}),
                        }}
                      >
                        {perms[mod][perm] && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
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
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {[
          { label: "All", color: "#63b3ed" },
          { label: "View", color: "#68d391" },
          { label: "Edit", color: "#f6ad55" },
          { label: "Delete", color: "#fc8181" },
        ].map(({ label, color }) => (
          <div key={label} style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: color }} />
            <span style={styles.legendText}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "transparent",
    padding: "8px 24px 32px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#e2e8f0",
    minHeight: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 600,
    color: "#e2e8f0",
    letterSpacing: "0.2px",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#718096",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid #4a5568",
    color: "#a0aec0",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #3182ce, #2b6cb0)",
    border: "none",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.3s",
    boxShadow: "0 2px 8px rgba(49,130,206,0.35)",
  },
  saveBtnSuccess: {
    background: "linear-gradient(135deg, #276749, #22543d)",
    boxShadow: "0 2px 8px rgba(39,103,73,0.4)",
  },
  tableWrapper: {
    background: "#1a202c",
    borderRadius: "12px",
    border: "1px solid #2d3748",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "14px 20px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#718096",
    borderBottom: "1px solid #2d3748",
    background: "#171e2b",
  },
  thModule: {
    textAlign: "left",
    paddingLeft: "24px",
    width: "40%",
  },
  tr: {
    transition: "background 0.15s",
    borderBottom: "1px solid rgba(45,55,72,0.5)",
  },
  td: {
    padding: "14px 20px",
    textAlign: "center",
    verticalAlign: "middle",
  },
  tdModule: {
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#cbd5e0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  moduleDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#4a5568",
    flexShrink: 0,
  },
  checkLabel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  hiddenCheck: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  customCheck: {
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    border: "1.5px solid #4a5568",
    background: "#2d3748",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s",
    cursor: "pointer",
  },
  checkAll: {
    background: "#3182ce",
    border: "1.5px solid #3182ce",
    boxShadow: "0 0 8px rgba(49,130,206,0.4)",
  },
  checkView: {
    background: "#38a169",
    border: "1.5px solid #38a169",
    boxShadow: "0 0 8px rgba(56,161,105,0.4)",
  },
  checkEdit: {
    background: "#d97706",
    border: "1.5px solid #d97706",
    boxShadow: "0 0 8px rgba(217,119,6,0.4)",
  },
  checkDelete: {
    background: "#e53e3e",
    border: "1.5px solid #e53e3e",
    boxShadow: "0 0 8px rgba(229,62,62,0.4)",
  },
  legend: {
    display: "flex",
    gap: "20px",
    marginTop: "16px",
    paddingLeft: "4px",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "3px",
  },
  legendText: {
    fontSize: "12px",
    color: "#718096",
  },
};

export default ManagePermissions;