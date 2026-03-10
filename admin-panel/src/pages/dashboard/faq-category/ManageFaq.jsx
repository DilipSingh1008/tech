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
  usePatchItemMutation,
} from "../../../redux/api/apiSlice.js";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";
import { useSelector } from "react-redux";

const ManageFaq = () => {
  const { isDarkMode } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState("question");
  const [sortOrder, setSortOrder] = useState("asc");

  // ── Permission Logic ──
  const permissions = useSelector((state) => state.permission.permissions);
  const rawFaqPermission = permissions?.find((p) => p.module.name === "faq");
  const localRole = localStorage.getItem("role");
  const faqPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawFaqPermission;

  // ── RTK Query: fetch FAQs ──
  const { data: faqRes, isLoading } = useGetItemsQuery(
    `manage-faq?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
  );

  const faqs = faqRes?.data || [];
  const totalPages = faqRes?.pagination?.totalPages || 1;

  // ── RTK Query: fetch categories for dropdown ──
  const { data: catRes, isLoading: loadingCategories } =
    useGetItemsQuery("manage-faq/active");
  const categories = catRes?.data || [];

  // ── RTK Query: mutations ──
  const [createItem, { isLoading: createLoading }] = useCreateItemMutation();
  const [updateItem, { isLoading: updateLoading }] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [patchItem] = usePatchItemMutation();

  // ── Sort ──
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px]">
      {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteItem(`manage-faq/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Toggle Status ──
  const handleToggleStatus = async (id) => {
    try {
      await patchItem({ url: `manage-faq/toggle-status/${id}`, data: {} });
    } catch (err) {
      console.error("Failed to toggle FAQ status", err);
    }
  };

  // ── Modal Submit ──
  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateItem({
          url: `manage-faq/${editingItem._id}`,
          data: values,
        });
      } else {
        await createItem({ url: "manage-faq", data: values });
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Modal helpers ──
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const ValidationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    question: Yup.string().required("Question is required"),
    answer: Yup.string().required("Answer is required"),
  });

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

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1 min-w-[150px]">
              <Searchbar
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            {faqPermission?.add && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
              >
                <Plus size={14} /> Add FAQ
              </button>
            )}
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
                    <th className="px-4 py-3 w-16">ID</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-1">
                        Category <SortIcon field="category" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("question")}
                    >
                      <div className="flex items-center gap-1">
                        Question <SortIcon field="question" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("answer")}
                    >
                      <div className="flex items-center gap-1">
                        Answer <SortIcon field="answer" />
                      </div>
                    </th>
                    <th className="px-4 py-3 w-24">Status</th>
                    {(faqPermission?.edit || faqPermission?.delete) && (
                      <th className="px-4 py-3 text-right w-24">Action</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : faqs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 opacity-40">
                        No FAQs found.
                      </td>
                    </tr>
                  ) : (
                    faqs.map((item, index) => (
                      <tr
                        key={item._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-2.5 text-sm capitalize">
                          {item.category}
                        </td>
                        <td className="px-4 py-2.5">{item.question}</td>
                        <td className="px-4 py-2.5 truncate max-w-xs">
                          {item.answer}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(item._id)}
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

                        {(faqPermission?.edit || faqPermission?.delete) && (
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex justify-end gap-1">
                              {faqPermission?.edit && (
                                <div className="relative group">
                                  <button
                                    onClick={() => {
                                      setEditingItem(item);
                                      setIsModalOpen(true);
                                    }}
                                    className="cursor-pointer p-1.5 hover:text-(--primary)"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-blue-400 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                                    Edit FAQ
                                  </span>
                                </div>
                              )}

                              {faqPermission?.delete && (
                                <div className="relative group">
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    className="cursor-pointer p-1.5 hover:text-red-500"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                  <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-red-400 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                                    Delete FAQ
                                    <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        )}
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
                Showing {faqs.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage(page - 1)}
                  className="cursor-pointer p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
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
                  className="cursor-pointer p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div
                className={`${isDarkMode ? "bg-[#151b28] text-white" : "bg-white"} p-5 rounded-xl w-full max-w-sm shadow-xl`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">
                    {editingItem ? "Edit FAQ" : "New FAQ"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer opacity-60 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    category: editingItem?.category || "",
                    question: editingItem?.question || "",
                    answer: editingItem?.answer || "",
                  }}
                  validationSchema={ValidationSchema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Category *
                        </label>
                        <Field
                          as="select"
                          name="category"
                          className="cursor-pointer w-full p-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-(--primary)"
                          disabled={loadingCategories}
                        >
                          <option value="">
                            {loadingCategories
                              ? "Loading categories..."
                              : "-- Select Category --"}
                          </option>
                          {!loadingCategories &&
                            categories.map((cat) => (
                              <option key={cat._id} value={cat.category}>
                                {cat.category}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Question *
                        </label>
                        <Field
                          name="question"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-(--primary)"
                        />
                        <ErrorMessage
                          name="question"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Answer *
                        </label>
                        <Field
                          as="textarea"
                          name="answer"
                          rows="3"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-(--primary)"
                        />
                        <ErrorMessage
                          name="answer"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={
                          createLoading || updateLoading || isSubmitting
                        }
                        className="cursor-pointer w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50"
                      >
                        {editingItem
                          ? updateLoading
                            ? "Updating..."
                            : "Update FAQ"
                          : createLoading
                            ? "Creating..."
                            : "Create FAQ"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageFaq;
