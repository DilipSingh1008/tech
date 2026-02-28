import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../../services/api";
import { Link } from "react-router-dom";
import Searchbar from "../../../components/Searchbar";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useSelector } from "react-redux";

const ManageCategories = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: null, id: null });
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // ── Permission Logic ──
  const permissions = useSelector((state) => state.permission.permissions);
  const rawCategoryPermission = permissions?.find(
    (p) => p.module.name === "categories"
  );
  const localRole = localStorage.getItem("role");
  const categoryPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawCategoryPermission;

  useEffect(() => {
    fetchData("top");
  }, [page, sortBy, order]);

  const fetchData = async (parentCatId = null) => {
    try {
      let url = `categories?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`;
      if (parentCatId === "top") {
        url += `&catid=null`;
      }
      const res = await getItems(url);
      setCategories(res.data);
      setTotalPages(res.pagination?.totalPages || 1);
      if (res.pagination?.totalPages > 0 && page > res.pagination.totalPages) {
        setPage(res.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
    setPage(1);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateItem(`categories/${id}`, { status: !currentStatus });
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, status: !currentStatus } : cat
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(err.error || "Failed to update status");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!formData.id && !formData.icon) {
      alert("Icon is required for new category");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("folder", "categories");
    if (!formData.id || formData.icon instanceof File) {
      data.append("icon", formData.icon);
    }
    try {
      if (formData.id) {
        await updateItem(`categories/${formData.id}`, data);
      } else {
        await createItem("categories", data);
      }
      setIsModalOpen(false);
      setFormData({ name: "", icon: null, id: null });
      fetchData();
    } catch (err) {
      console.error("Error saving category:", err);
      alert(err.error || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteItem(`categories/${id}`);
        setCategories(categories.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Error deleting category:", err);
        alert(err.error || "Failed to delete category");
      }
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
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
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
          <div className="flex items-center justify-between mb-4">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />

            {categoryPermission?.add ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:bg-(--primary) transition-all"
              >
                <Plus size={14} /> Add Category
              </button>
            ) : null}
          </div>

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
                    <th
                      onClick={() => handleSort("name")}
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Name
                        <span className="opacity-50 text-[10px]">
                          {sortBy === "name"
                            ? order === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 w-16">Icon</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    {(categoryPermission?.edit || categoryPermission?.delete) ? (
                      <th className="px-4 py-3 text-right w-24">Action</th>
                    ) : null}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {categories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-indigo-500/5 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-semibold">
                        {(page - 1) * limit + (index + 1)}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-sm">
                        <Link
                          to={`/dashboard/category/${cat._id}`}
                          className="px-4 py-2.5 font-semibold text-sm hover:text-(--primary)"
                        >
                          {cat.name}
                        </Link>
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
                          className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                            cat.status ? "bg-(--primary)" : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`cursor-pointer absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                              cat.status ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>

                      {(categoryPermission?.edit ||
                        categoryPermission?.delete) ? (
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            {/* EDIT */}
                            {categoryPermission?.edit ? (
                              <div className="relative group">
                                <button
                                  onClick={() => {
                                    setFormData({
                                      name: cat.name,
                                      icon: `http://localhost:5000${cat.icon}`,
                                      id: cat._id,
                                    });
                                    setIsModalOpen(true);
                                  }}
                                  className="cursor-pointer p-1.5 hover:text-(--primary) transition-colors"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-blue-400 text-[10px] px-2 py-2 rounded whitespace-nowrap pointer-events-none">
                                  Edit category
                                </span>
                              </div>
                            ) : null}

                            {/* DELETE */}
                            {categoryPermission?.delete ? (
                              <div className="relative group">
                                <button
                                  onClick={() => handleDelete(cat._id)}
                                  className="cursor-pointer p-1.5 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-red-400 text-[10px] px-2 py-2 rounded whitespace-nowrap pointer-events-none">
                                  Delete category
                                  <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`flex items-center justify-between p-3 border-t ${theme.divider}`}
            >
              <span className="text-[11px] opacity-60">
                Showing {categories.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 cursor-pointer border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] rounded-md border transition-all ${
                      page === i + 1
                        ? "bg-(--primary) text-white cursor-pointer border-(--primary) shadow-sm"
                        : "hover:border-(--primary) cursor-pointer hover:text-(--primary) border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 cursor-pointer border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`${
                  isDarkMode ? "bg-[#151b28] text-white" : "bg-white"
                } p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}
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
                  </div>

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
                    className="cursor-pointer w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:bg-(--primary) transition-all"
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