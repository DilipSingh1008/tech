import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ManageCategories = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("category");
  const [formData, setFormData] = useState({
    name: "",
    icon: null,
    image: null,
    categoryId: "",
  });

  const CATEGORY_API = "http://localhost:5000/api/categories";
  const SUBCATEGORY_API = "http://localhost:5000/api/subcategories";

  const handleSave = async (e) => {
    e.preventDefault();

    const url = modalType === "category" ? CATEGORY_API : SUBCATEGORY_API;

    const data = new FormData();
    data.append("name", formData.name);

    if (modalType === "category") {
      data.append("icon", formData.icon);
    } else {
      data.append("image", formData.image);
      data.append("categoryId", formData.categoryId);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: data, // ❗ NO headers
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          name: "",
          icon: null,
          image: null,
          categoryId: "",
        });
        fetchData();
        alert(`${modalType} added successfully!`);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        fetch(CATEGORY_API),
        fetch(SUBCATEGORY_API),
      ]);
      const cats = await catRes.json();
      const subs = await subRes.json();

      const merged = cats.map((cat) => {
        const filteredSubs = subs.filter((sub) => {
          const subParentId =
            typeof sub.category === "object" ? sub.category._id : sub.category;
          return String(subParentId) === String(cat._id);
        });
        return { ...cat, subCategories: filteredSubs };
      });
      setCategories(merged);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus, isSub) => {
    console.log(
      `Toggling ${isSub ? "Sub" : "Cat"} ID: ${id} to ${!currentStatus}`,
    );

    setCategories((prev) =>
      prev.map((cat) => {
        if (!isSub && cat._id === id) return { ...cat, status: !currentStatus };
        if (isSub) {
          return {
            ...cat,
            subCategories: cat.subCategories.map((sub) =>
              sub._id === id ? { ...sub, status: !currentStatus } : sub,
            ),
          };
        }
        return cat;
      }),
    );
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedIds);
    expandedIds.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedIds(newSet);
  };

  const StatusToggle = ({ status, onToggle }) => (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${status ? "bg-indigo-600" : "bg-gray-400"}`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${status ? "translate-x-5" : "translate-x-0"}`}
      />
    </div>
  );

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-200"
      : "bg-gray-50 text-gray-800",
    card: isDarkMode
      ? "bg-[#151b28] border-gray-800"
      : "bg-white border-gray-200",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-600",
    subHeader: isDarkMode
      ? "bg-[#252d3d] text-indigo-300"
      : "bg-indigo-50 text-indigo-900",
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-bold italic">
        Updating View...
      </div>
    );

  return (
    <div className={`h-screen w-full overflow-hidden ${theme.main}`}>
      <main className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight"></h2>
            <button
              onClick={() => {
                setModalType("category");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all"
            >
              <Plus size={18} /> Add New
            </button>
            <button
              onClick={() => {
                setModalType("subcategory");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              <Plus size={18} /> Add SubCategory
            </button>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div
                  className={`${isDarkMode ? "bg-[#151b28] text-white" : "bg-white"} p-6 rounded-xl w-96 shadow-2xl border border-gray-700`}
                >
                  <h3 className="text-xl font-bold mb-4">
                    Add New{" "}
                    {modalType === "category" ? "Category" : "Sub-Category"}
                  </h3>

                  <form onSubmit={handleSave} className="space-y-4">
                    {/* Common Name Field */}
                    <div>
                      <label className="text-xs font-bold opacity-50 uppercase">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-2 rounded bg-gray-500/10 border border-gray-500/20 outline-none focus:border-indigo-500"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Conditional Fields based on Type */}
                    {modalType === "category" ? (
                      <div>
                        <label className="text-xs font-bold opacity-50 uppercase">
                          Icon URL
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          className="w-full p-2 rounded bg-gray-500/10 border border-gray-500/20 outline-none"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              icon: e.target.files[0],
                            })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs font-bold opacity-50 uppercase">
                            Parent Category
                          </label>
                          <select
                            required
                            className="w-full p-2 rounded bg-gray-500/10 border border-gray-500/20 outline-none text-black"
                            value={formData.categoryId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                categoryId: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-50 uppercase">
                            Image URL
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 rounded bg-gray-500/10 border border-gray-500/20 outline-none"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image: e.target.files[0],
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-2 bg-gray-500/20 rounded hover:bg-gray-500/30"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                      >
                        Save Data
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div
            className={`rounded-xl border shadow-2xl overflow-hidden ${theme.card}`}
          >
            <table className="w-full text-left border-collapse">
              <thead
                className={`text-[11px] uppercase tracking-widest font-black ${theme.header}`}
              >
                <tr>
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {categories.map((cat) => (
                  <React.Fragment key={cat._id}>
                    {/* Category Row */}
                    <tr
                      className="hover:bg-indigo-500/5 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(cat._id)}
                    >
                      <td className="px-6 py-4 text-center">
                        {expandedIds.has(cat._id) ? (
                          <ChevronDown size={18} className="text-indigo-500" />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-[10px] font-mono opacity-50 italic">
                        {cat._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 font-bold text-lg">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 flex items-center justify-center rounded bg-indigo-500/10 uppercase font-bold text-xs text-indigo-600">
                          {cat.icon && cat.icon.includes("http") ? (
                            <img
                              src={`http://localhost:5000/uploads/categories/${cat.icon}`}
                              className="w-6 h-6 object-contain"
                              alt=""
                            />
                          ) : (
                            cat.name.charAt(0)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusToggle
                          status={cat.status}
                          onToggle={() =>
                            handleToggleStatus(cat._id, cat.status, false)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="flex justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="p-2 hover:bg-amber-500/10 text-amber-500 rounded-md transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-Items Structure */}
                    {expandedIds.has(cat._id) && (
                      <>
                        <tr
                          className={`${theme.subHeader} border-l-4 border-indigo-500`}
                        >
                          <th className="px-6 py-2"></th>
                          <th className="px-6 py-2 text-[10px] font-bold uppercase">
                            ID
                          </th>
                          <th className="px-6 py-2 text-[10px] font-bold uppercase">
                            Subcategory
                          </th>
                          <th className="px-6 py-2 text-[10px] font-bold uppercase">
                            Image
                          </th>
                          <th className="px-6 py-2 text-[10px] font-bold uppercase">
                            Status
                          </th>
                          <th className="px-6 py-2 text-right text-[10px] font-bold uppercase">
                            Action
                          </th>
                        </tr>
                        {cat.subCategories.map((sub) => (
                          <tr
                            key={sub._id}
                            className={`${isDarkMode ? "bg-black/20" : "bg-gray-50/50"} border-l-4 border-indigo-500`}
                          >
                            <td className="px-6 py-3"></td>
                            <td className="px-6 py-3 text-[10px] font-mono opacity-40 italic">
                              {sub._id.slice(-8)}
                            </td>
                            <td className="px-6 py-3 text-sm font-semibold">
                              {sub.name}
                            </td>
                            <td className="px-6 py-3">
                              {sub.image ? (
                                <img
                                  src={`http://localhost:5000/uploads/subcategories/${sub.image}`}
                                  className="w-10 h-10 rounded-lg object-cover border-2 border-indigo-500/10"
                                  alt=""
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <ImageIcon size={14} className="opacity-20" />
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-3">
                              <StatusToggle
                                status={sub.status}
                                onToggle={() =>
                                  handleToggleStatus(sub._id, sub.status, true)
                                }
                              />
                            </td>
                            <td className="px-6 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors">
                                  <Edit3 size={14} />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageCategories;
