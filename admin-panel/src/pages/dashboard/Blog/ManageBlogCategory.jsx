import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "../../../redux/api/apiSlice.js";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";

const ManageBlogCategory = () => {
  const { isDarkMode } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState("name");
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

  // ── RTK Query: fetch categories ───────────────────────────────────────────
  const { data, isLoading } = useGetItemsQuery(
    `blog-category?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
  );

  const categories = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // ── RTK Query: mutations ──────────────────────────────────────────────────
  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  // ── Sort ──────────────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // ── Status Toggle ─────────────────────────────────────────────────────────
  const handleToggleStatus = async (item) => {
    await updateItem({
      url: `blog-category/toggle-status/${item._id}`,
      data: { status: !item.status },
    });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteItem(`blog-category/${id}`);
    }
  };

  // ── Submit (create / update) ──────────────────────────────────────────────
  const handleSubmit = async (values) => {
    if (editingItem) {
      await updateItem({
        url: `blog-category/${editingItem._id}`,
        data: values,
      }).unwrap();
    } else {
      await createItem({ url: "blog-category", data: values }).unwrap();
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
  });

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1 min-w-[150px]">
              <Searchbar
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>

          {/* Category Table */}
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
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        <span className="opacity-50 text-[10px]">
                          {sortField === "name"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 opacity-40">
                        No categories found.
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
                        <td className="px-4 py-2.5 capitalize">{item.name}</td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(item)}
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
                            className="cursor-pointer p-1.5 hover:text-(--primary) transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="cursor-pointer p-1.5 hover:text-red-500 transition-colors"
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

            {/* Pagination */}
            <div
              className={`flex items-center justify-between p-3 border-t ${theme.divider}`}
            >
              <span className="text-[11px] opacity-60">
                Showing {categories.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage(page - 1)}
                  className="cursor-pointer p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`cursor-pointer w-7 h-7 text-[11px] rounded-md border transition-all ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary)"
                        : "border-transparent hover:border-(--primary) hover:text-(--primary)"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages || isLoading}
                  onClick={() => setPage(page + 1)}
                  className="cursor-pointer p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Form */}
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
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                    }}
                    className="cursor-pointer opacity-50 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{ name: editingItem?.name || "" }}
                  validationSchema={ValidationSchema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  <Form className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                        Name *
                      </label>
                      <Field
                        name="name"
                        className="w-full p-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-(--primary)"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-[10px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold"
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

export default ManageBlogCategory;
