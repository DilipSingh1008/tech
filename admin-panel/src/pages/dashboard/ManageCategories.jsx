import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  X,
  RefreshCcw,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ManageCategories = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: null, id: null });

  const CATEGORY_API = "http://localhost:5000/api/categories";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(CATEGORY_API);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await fetch(`${CATEGORY_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, status: !currentStatus } : cat,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);

    // Only append icon if it's a File object (new image)
    if (formData.icon instanceof File) {
      data.append("icon", formData.icon);
    }

    try {
      let url = CATEGORY_API;
      let method = "POST";

      if (formData.id) {
        url = `${CATEGORY_API}/${formData.id}`;
        method = "PUT";
      }

      const response = await fetch(url, { method, body: data });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", icon: null, id: null });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border-gray-800"
      : "bg-white border-gray-200",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-500",
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs font-medium">
        Loading...
      </div>
    );

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Categories</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:bg-(--primary) transition-all"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>

          {/* Table */}
          <div
            className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-20">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 w-16">Icon</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-indigo-500/5 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                        {cat._id.slice(-6)}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-sm">
                        {cat.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="w-8 h-8 rounded bg-gray-500/10 border border-gray-500/10 overflow-hidden flex items-center justify-center">
                          {cat.icon ? (
                            <img
                              src={`http://localhost:5000${cat.icon}`}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          ) : (
                            <ImageIcon size={14} className="opacity-30" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() =>
                            handleToggleStatus(cat._id, cat.status)
                          }
                          className={`w-8 h-4 rounded-full relative transition-colors ${cat.status ? "bg-(--primary)" : "bg-gray-400"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${cat.status ? "left-4.5" : "left-0.5"}`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-1.5 hover:text-(--primary) transition-colors">
                            <RefreshCcw size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setFormData({
                                name: cat.name,
                                icon: `http://localhost:5000${cat.icon}`,
                                id: cat._id,
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 hover:text-(--primary) transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this category?",
                                )
                              ) {
                                try {
                                  const res = await fetch(
                                    `${CATEGORY_API}/${cat._id}`,
                                    { method: "DELETE" },
                                  );
                                  if (res.ok)
                                    setCategories(
                                      categories.filter(
                                        (c) => c._id !== cat._id,
                                      ),
                                    );
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className="p-1.5 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`${isDarkMode ? "bg-[#151b28] text-white" : "bg-white"} p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">
                    {formData.id ? "Edit Category" : "New Category"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ name: "", icon: null, id: null });
                    }}
                    className="opacity-50 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>{" "}
                  {formData.icon && (
                    <img
                      src={
                        formData.icon instanceof File
                          ? URL.createObjectURL(formData.icon)
                          : formData.icon
                      }
                      alt="Category Icon"
                      className="w-16 h-16 object-cover rounded mb-2"
                    />
                  )}
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Icon Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required={!formData.id}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white hover:file:bg-(--primary) cursor-pointer"
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.files[0] })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:bg-(--primary) transition-all"
                  >
                    {formData.id ? "Update Category" : "Create Category"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCategories;
