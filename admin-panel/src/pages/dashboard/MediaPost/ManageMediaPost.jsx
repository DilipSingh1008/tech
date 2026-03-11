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
import CommonImage from "../../../components/CommonImage.jsx";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ManageMediaPost = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Queries & Mutations
  const {
    data: res,
    isLoading,
    refetch,
  } = useGetItemsQuery(
    `media-posts?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
  );

  const posts = res?.data || [];
  const totalPages = res?.pagination?.totalPages || 1;

  const [createItem, { isLoading: createLoading }] = useCreateItemMutation();
  const [updateItem, { isLoading: updateLoading }] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [patchItem] = usePatchItemMutation();

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else (setSortField(field), setSortOrder("asc"));
    setPage(1);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteItem(`media-posts/${id}`);
    refetch();
  };

  const handleToggleStatus = async (id, status) => {
    await patchItem({
      url: `media-posts/toggle-status/${id}`,
      data: { status: !status },
    });
    refetch();
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("folder", "media-posts");

    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (editingItem) {
      await updateItem({
        url: `media-posts/${editingItem._id}`,
        data: formData,
      });
    } else {
      await createItem({ url: "media-posts", data: formData });
    }
    closeModal();
    refetch();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const ValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    year: Yup.number().required("Year is required").min(2000).max(2100),
    month: Yup.string().required("Month is required"),
    publishDate: Yup.date().required("Publish date is required"),
    image: Yup.mixed().required("Image is required"),
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
  console.log(posts);
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
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <Plus size={14} /> Add Post
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
                    <th className="px-4 py-3 w-16">ID</th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      Title
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("year")}
                    >
                      Year
                    </th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Publish Date</th>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : posts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6">
                        No posts found
                      </td>
                    </tr>
                  ) : (
                    posts.map((item, idx) => (
                      <tr key={item._id} className="hover:bg-indigo-500/5">
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + idx + 1}
                        </td>
                        <td className="px-4 py-2.5">{item.title}</td>
                        <td className="px-4 py-2.5">{item.year}</td>
                        <td className="px-4 py-2.5">{item.month}</td>
                        <td className="px-4 py-2.5">
                          {new Date(item.publishDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2.5">
                          <CommonImage
                            src={
                              item.image
                                ? `http://localhost:5000${item.image}`
                                : null
                            }
                            alt={item.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() =>
                              handleToggleStatus(item._id, item.status)
                            }
                            className={`w-8 h-4 cursor-pointer rounded-full relative ${item.status ? "bg-(--primary)" : "bg-gray-400"}`}
                          >
                            <div
                              className={`absolute cursor-pointer top-0.5 w-3 h-3 bg-white rounded-full ${item.status ? "left-4.5" : "left-0.5"}`}
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
                              className="cursor-pointer p-1.5 hover:text-(--primary)"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="cursor-pointer p-1.5 hover:text-red-500"
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
                Showing {posts.length} entries
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
                    className={`w-7 h-7 text-[11px] cursor-pointer rounded-md border ${page === i + 1 ? "bg-(--primary) text-white" : ""}`}
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
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div
                className={`${isDarkMode ? "bg-[#151b28] text-slate-200" : "bg-white text-gray-700"} w-full max-w-md rounded-xl shadow-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold">
                    {editingItem ? "Edit Post" : "Add Post"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="opacity-60 cursor-pointer hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5">
                  <Formik
                    initialValues={{
                      title: editingItem?.title || "",
                      year: editingItem?.year || "",
                      month: editingItem?.month || "",
                      publishDate: editingItem?.publishDate
                        ? new Date(editingItem.publishDate)
                            .toISOString()
                            .substr(0, 10)
                        : "",
                      image: null,
                    }}
                    validationSchema={ValidationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                  >
                    {({ setFieldValue, isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Title *
                          </label>
                          <Field
                            name="title"
                            placeholder="Enter title"
                            className="w-full  p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700"
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        <div>
                          <label className="block cursor-pointer text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Year *
                          </label>
                          <Field
                            name="year"
                            type="number"
                            placeholder="2026"
                            className="w-full cursor-pointer p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700"
                          />
                          <ErrorMessage
                            name="year"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        <div>
                          <label className=" block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Month *
                          </label>
                          <Field
                            as="select"
                            name="month"
                            className="w-full cursor-pointer p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700"
                          >
                            <option value="">Select Month</option>
                            {months.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="month"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        <div>
                          <label className=" block text-[10px] font-semibold uppercase opacity-60 mb-1">
                            Publish Date *
                          </label>
                          <Field
                            name="publishDate"
                            type="date"
                            className="w-full cursor-pointer p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700"
                          />
                          <ErrorMessage
                            name="publishDate"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px]  font-semibold uppercase opacity-60 mb-1">
                            Image *
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setFieldValue("image", e.currentTarget.files[0])
                            }
                            className="w-full cursor-pointer p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700"
                          />
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

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
                              : "Update Post"
                            : createLoading
                              ? "Creating..."
                              : "Create Post"}
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

export default ManageMediaPost;
