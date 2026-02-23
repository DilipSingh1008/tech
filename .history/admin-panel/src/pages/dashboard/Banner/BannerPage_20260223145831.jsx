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
} from "../../../services/api";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";

// Function to validate image dimensions
const validateImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 200 && img.height === 200) {
        resolve(true);
      } else {
        reject("Image must be exactly 200x200 px");
      }
    };
    img.onerror = () => reject("Invalid image file");
  });
};

const BannerPage = () => {
  const { isDarkMode } = useTheme();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

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
    fetchBanners();
  }, [page]);

  const fetchBanners = async () => {
    try {
      const res = await getItems(`banners?page=${page}&limit=${limit}`);
      setBanners(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteItem(`banners/${id}`);
        setBanners(banners.filter((b) => b._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const BannerSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    url: Yup.string().url("Enter a valid URL"),
    image: Yup.mixed().when("isEdit", {
      is: false, // new banner
      then: Yup.mixed().required("Banner image is required"),
      otherwise: Yup.mixed(), // edit me optional
    }),
  });

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
            <button
              onClick={() => {
                setEditingBanner(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:bg-(--primary) transition-all"
            >
              <Plus size={14} /> Add Banner
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
                    <th className="px-4 py-3 w-20">ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3 w-24">Image</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {banners
                    .filter((b) =>
                      b.title.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((b, index) => (
                      <tr
                        key={b._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-2.5">{b.title}</td>
                        <td className="px-4 py-2.5">
                          <img
                            src={`http://localhost:5000${b.image}`}
                            alt="banner"
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          {b.status ? "Active" : "Inactive"}
                        </td>
                        <td className="px-4 py-2.5 text-right flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingBanner(b);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 hover:text-(--primary)"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-1.5 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
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
                Showing {banners.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] rounded-md border transition-all ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary) shadow-sm"
                        : "hover:border-(--primary) hover:text-(--primary) border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Form */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`${isDarkMode ? "bg-[#151b28] text-white" : "bg-white"} p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">
                    {editingBanner ? "Edit Banner" : "New Banner"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="opacity-50 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    title: editingBanner?.title || "",
                    url: editingBanner?.url || "",
                    // status: editingBanner?.status || true,
                    image: null,
                  }}
                  validationSchema={BannerSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const data = new FormData();
                      data.append("title", values.title);
                      data.append("url", values.url);
                      // data.append("status", values.status);
                      if (values.image) data.append("image", values.image);

                      if (editingBanner) {
                        await updateItem(`banners/${editingBanner._id}`, data);
                      } else {
                        await createItem("banners", data);
                      }
                      setIsModalOpen(false);
                      fetchBanners();
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ setFieldValue, values }) => (
                    <Form className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Title <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          type="text"
                          name="title"
                          className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          URL
                        </label>
                        <Field
                          type="text"
                          name="url"
                          className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Banner Image (200x200 px)
                          <span className="text-red-500 text-sm">*</span>{" "}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.currentTarget.files[0];
                            if (file) {
                              try {
                                await validateImageDimensions(file);
                                setFieldValue("image", file);
                              } catch (err) {
                                alert(err);
                                setFieldValue("image", null);
                              }
                            }
                          }}
                          className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white hover:file:bg-(--primary) cursor-pointer"
                        />
                        {values.image && (
                          <img
                            src={
                              values.image instanceof File
                                ? URL.createObjectURL(values.image)
                                : values.image
                            }
                            alt="banner"
                            className="w-16 h-16 object-cover rounded mt-2"
                          />
                        )}
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      {/* <div className="flex items-center gap-2">
                        <Field
                          type="checkbox"
                          name="status"
                          className="cursor-pointer"
                        />
                        <label className="text-[10px]">Active</label>
                      </div> */}

                      <button
                        type="submit"
                        className="w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:bg-(--primary) transition-all"
                      >
                        {editingBanner ? "Update Banner" : "Create Banner"}
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

export default BannerPage;
