import React, { useMemo, useState } from "react";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
  useUpdateItemMutation,
} from "../../../redux/api/apiSlice";

const defaultForm = {
  label: "",
  name: "",
  order: 999,
  view: true,
  add: true,
  edit: true,
  delete: true,
};

const ManageModules = () => {
  const { data, isLoading } = useGetItemsQuery("role/module/all");
  const modules = useMemo(() => data || [], [data]);

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [createItem, { isLoading: creating }] = useCreateItemMutation();
  const [updateItem, { isLoading: updating }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: disabling }] = useDeleteItemMutation();

  const busy = creating || updating || disabling;

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editingId) {
        await updateItem({
          url: `role/module/${editingId}`,
          data: {
            label: form.label,
            order: Number(form.order) || 999,
            view: form.view,
            add: form.add,
            edit: form.edit,
            delete: form.delete,
          },
        }).unwrap();
        setMessage("Module updated.");
      } else {
        await createItem({
          url: "role/module",
          data: {
            label: form.label,
            name: form.name,
            order: Number(form.order) || 999,
            view: form.view,
            add: form.add,
            edit: form.edit,
            delete: form.delete,
          },
        }).unwrap();
        setMessage("Module created.");
      }
      resetForm();
    } catch (err) {
      setError(err?.data?.message || "Request failed");
    }
  };

  const onEdit = (mod) => {
    setEditingId(mod._id);
    setForm({
      label: mod.label || "",
      name: mod.name || "",
      order: mod.order ?? 999,
      view: mod.view !== false,
      add: mod.add !== false,
      edit: mod.edit !== false,
      delete: mod.delete !== false,
    });
    setMessage("");
    setError("");
  };

  const onDisable = async (id) => {
    setMessage("");
    setError("");
    try {
      await deleteItem(`role/module/${id}`).unwrap();
      if (editingId === id) resetForm();
      setMessage("Module disabled.");
    } catch (err) {
      setError(err?.data?.message || "Disable failed");
    }
  };

  return (
    <div className="p-6 text-gray-200">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-100">Manage Modules</h2>
        <p className="text-sm text-gray-400">
          Add modules from panel. These will appear in the permissions page.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            placeholder="Module label (e.g. Reports)"
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            required
          />
          <input
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            placeholder="Module name (optional, e.g. reports)"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            disabled={!!editingId}
          />
          <input
            type="number"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          {["view", "add", "edit", "delete"].map((key) => (
            <label key={key} className="inline-flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {editingId ? "Update Module" : "Create Module"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p className="text-sm text-green-400 mb-3">{message}</p>}
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Label</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Name</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Order</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Status</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Fields</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-sm text-gray-400">Loading modules...</td>
              </tr>
            )}
            {!isLoading && modules.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-sm text-gray-400">No modules found.</td>
              </tr>
            )}
            {!isLoading &&
              modules.map((mod) => (
                <tr key={mod._id} className="border-t border-gray-800">
                  <td className="px-4 py-3 text-sm">{mod.label}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{mod.name}</td>
                  <td className="px-4 py-3 text-sm">{mod.order ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={mod.status ? "text-green-400" : "text-gray-500"}>
                      {mod.status ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    V:{mod.view === false ? "N" : "Y"} | A:{mod.add === false ? "N" : "Y"} | E:{mod.edit === false ? "N" : "Y"} | D:{mod.delete === false ? "N" : "Y"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(mod)}
                        className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-xs"
                      >
                        Edit
                      </button>
                      {mod.status && (
                        <button
                          type="button"
                          onClick={() => onDisable(mod._id)}
                          className="px-3 py-1.5 rounded-md bg-red-700 hover:bg-red-600 text-xs"
                        >
                          Disable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageModules;
