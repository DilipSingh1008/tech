import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext.jsx";
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
import Searchbar from "../../../components/Searchbar.jsx";
import { useSelector } from "react-redux";

const ManageCareer = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const permissions = useSelector((state) => state.permission.permissions);
  const rawPermission = permissions?.find((p) => p.module.name === "career");
  const localRole = localStorage.getItem("role");

  const careerPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawPermission;

  const { data: res, isLoading } = useGetItemsQuery(
    `career?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
  );

  const careers = res?.data || [];
  const totalPages = res?.pagination?.totalPages || 1;

  const [createItem, { isLoading: createLoading }] = useCreateItemMutation();
  const [updateItem, { isLoading: updateLoading }] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [patchItem] = usePatchItemMutation();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this career?")) return;
    await deleteItem(`career/${id}`);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await patchItem({
        url: `career/toggle-status/${id}`,
        data: { status: !currentStatus },
      });
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update status");
    }
  };

  const handleSubmit = async (values) => {
    if (editingItem) {
      await updateItem({
        url: `career/${editingItem._id}`,
        data: values,
      });
    } else {
      await createItem({ url: "career", data: values });
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const ValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    location: Yup.string().required("Location is required"),
    positions: Yup.number().required("Number of positions required"),
    description: Yup.string().required("Description required"),
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

  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px]">
      {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );
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
            {careerPermission?.add && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="flex  cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
              >
                <Plus size={14} /> Add Career
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
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      Title <SortIcon field="title" />
                    </th>

                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("location")}
                    >
                      Location
                    </th>

                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("positions")}
                    >
                      Positions
                    </th>

                    <th className="px-4 py-3">Description</th>

                    <th className="px-4 py-3 w-24">Status</th>

                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    careers.map((item, index) => (
                      <tr key={item._id} className="hover:bg-indigo-500/5">
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + index + 1}
                        </td>

                        <td className="px-4 py-2.5">{item.title}</td>

                        <td className="px-4 py-2.5">{item.location}</td>

                        <td className="px-4 py-2.5">{item.positions}</td>

                        <td className="px-4 py-2.5 truncate max-w-xs">
                          {item.description}
                        </td>

                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(item._id)}
                            className={`w-8 h-4 cursor-pointer rounded-full relative ${
                              item.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full ${
                                item.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 cursor-pointer hover:text-(--primary)"
                            >
                              <Edit3 size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 cursor-pointer hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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
                Showing {careers.length} entries
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 cursor-pointer border rounded-md"
                >
                  <FiChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 cursor-pointer text-[11px] rounded-md border ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary)"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 cursor-pointer border rounded-md"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modal */}
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#151b28] text-slate-200"
                    : "bg-white text-gray-700"
                } w-full max-w-md rounded-xl shadow-xl border ${
                  isDarkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold">
                    {editingItem ? "Edit Career" : "Add Career"}
                  </h3>

                  <button
                    onClick={closeModal}
                    className="opacity-60 cursor-pointer hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5">
                  <Formik
                    initialValues={{
                      title: editingItem?.title || "",
                      location: editingItem?.location || "",
                      positions: editingItem?.positions || "",
                      description: editingItem?.description || "",
                    }}
                    validationSchema={ValidationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Job Title *
                          </label>

                          <Field
                            name="title"
                            placeholder="Enter job title"
                            className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-(--primary)"
                          />

                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Location *
                          </label>

                          <Field
                            name="location"
                            placeholder="Enter location"
                            className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-(--primary)"
                          />

                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        {/* Positions */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Number of Positions *
                          </label>

                          <Field
                            name="positions"
                            type="number"
                            placeholder="Enter positions"
                            className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-(--primary)"
                          />

                          <ErrorMessage
                            name="positions"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Description *
                          </label>

                          <Field
                            as="textarea"
                            name="description"
                            rows="3"
                            placeholder="Enter job description"
                            className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-(--primary)"
                          />

                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={
                            createLoading || updateLoading || isSubmitting
                          }
                          className="w-full cursor-pointer py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition"
                        >
                          {editingItem
                            ? updateLoading
                              ? "Updating..."
                              : "Update Career"
                            : createLoading
                              ? "Creating..."
                              : "Create Career"}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCareer;
