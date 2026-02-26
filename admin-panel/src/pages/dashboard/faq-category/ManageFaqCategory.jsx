import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem,
} from "../../../services/api";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";

const ManageFaqCategory = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("category");
  const [sortOrder, setSortOrder] = useState("asc");
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

  useEffect(() => {
    fetchCategories();
  }, [page, searchQuery, sortField, sortOrder]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getItems(
        `faq-category?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
      );
      setCategories(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteItem(`faq-category/${id}`);
      fetchCategories();
    }
  };

  const ValidationSchema = Yup.object().shape({
    category: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
  });
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await patchItem(`faq-category/toggle-status/${id}`, {});
      setCategories((prev) =>
        prev.map((faq) =>
          faq._id === id ? { ...faq, status: !currentStatus } : faq,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle FAQ status", err);
    }
  };
  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <Plus size={14} /> Add Category
            </button>
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
                    <th className="px-4 py-3 w-16">ID</th>
                    <th
                      onClick={() => handleSort("category")}
                      className="px-4 py-3  cursor-pointer"
                    >
                      Category
                      <span className="opacity-50 text-[10px]">
                        {sortField === "category"
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("description")}
                      className=" cursor-pointer px-4 py-3 "
                    >
                      Description
                      <span className="opacity-50 text-[10px]">
                        {sortField === "description"
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    </th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    categories.map((item, index) => (
                      <tr
                        key={item._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + index + 1}
                        </td>

                        <td className="px-4 py-2.5 font-semibold text-sm capitalize">
                          {item.category}
                        </td>

                        <td className="px-4 py-2.5 text-xs opacity-80 max-w-xs truncate">
                          {item.description}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() =>
                              handleToggleStatus(item._id, item.status)
                            }
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              item.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                item.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-2.5 text-right flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            className=" cursor-pointer p-1.5 hover:text-(--primary)"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className=" cursor-pointer p-1.5 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
                  className=" cursor-pointer p-1.5 border rounded-md disabled:opacity-30"
                >
                  <FiChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={` cursor-pointer w-7 h-7 text-[11px] rounded-md border ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary)"
                        : "border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className=" cursor-pointer p-1.5 border rounded-md disabled:opacity-30"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div
                className={`${
                  isDarkMode ? "bg-[#151b28] text-white" : "bg-white"
                } p-5 rounded-xl w-full max-w-sm shadow-xl`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">
                    {editingItem ? "Edit Category" : "New Category"}
                  </h3>
                  <button
                    className="cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    category: editingItem?.category || "",
                    description: editingItem?.description || "",
                  }}
                  validationSchema={ValidationSchema}
                  enableReinitialize
                  onSubmit={async (values) => {
                    if (editingItem) {
                      await updateItem(
                        `faq-category/${editingItem._id}`,
                        values,
                      );
                    } else {
                      await createItem("faq-category", values);
                    }
                    setIsModalOpen(false);
                    fetchCategories();
                  }}
                >
                  <Form className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                        Category *
                      </label>
                      <Field
                        name="category"
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20"
                      />
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-[10px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                        Description *
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows="3"
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-[10px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className=" cursor-pointer w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold"
                    >
                      {editingItem ? "Update Category" : "Create Category"}
                    </button>
                  </Form>
                </Formik>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageFaqCategory;
