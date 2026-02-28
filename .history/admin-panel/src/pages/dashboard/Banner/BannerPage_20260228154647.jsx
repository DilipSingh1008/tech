import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2, Edit3, X, ImageIcon } from "lucide-react";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../../services/api";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";
import { useSelector } from "react-redux";

const validateImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      if (width >= 200 && width <= 500 && height >= 200 && height <= 500) {
        resolve(true);
      } else {
        reject("Image must be between 200x200 px and 500x500 px");
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

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // ── Permission Logic ──
  const permissions = useSelector((state) => state.permission.permissions);
  const rawBannerPermission = permissions?.find(
    (p) => p.module.name === "banner"
  );
  const localRole = localStorage.getItem("role");
  const bannerPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawBannerPermission;

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
    setLoading(true);
    try {
      const res = await getItems(`banner?page=${page}&limit=${limit}`);
      setBanners(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
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
  };

  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px]">
      {sortBy === field ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  const processedBanners = [...banners]
    .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteItem(`banner/${id}`);
        setBanners(banners.filter((b) => b._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const BannerSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    url: Yup.string()
      .nullable()
      .notRequired()
      .test(
        "is-valid-url",
        "Enter a valid URL",
        (value) => !value || /^https?:\/\/.+\..+/.test(value)
      ),
    image: Yup.mixed().when("isEdit", {
      is: false,
      then: (schema) => schema.required("Image is required"),
      otherwise: (schema) => schema,
    }),
  });

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateItem(`banner/${id}`, { status: !currentStatus });
      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === id ? { ...banner, status: !currentStatus } : banner
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update status");
    }
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
          <div className="flex cursor-pointer items-center justify-between mb-4">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />

            {bannerPermission?.add ? (
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:bg-(--primary) transition-all"
              >
                <Plus size={14} /> Add Banner
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
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Title <SortIcon field="title" />
                      </div>
                    </th>

                    <th className="px-4 py-3 w-24">Image</th>

                    <th className="px-4 py-3 w-24 cursor-pointer hover:text-(--primary) transition-colors">
                      <div className="flex items-center gap-1">
                        Status <SortIcon field="status" />
                      </div>
                    </th>

                    {(bannerPermission?.edit || bannerPermission?.delete) ? (
                      <th className="px-4 py-3 text-right w-24">Action</th>
                    ) : null}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {processedBanners.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No banners found.
                      </td>
                    </tr>
                  ) : (
                    processedBanners.map((b, index) => (
                      <tr
                        key={b._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-sm">
                          {b.title}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="w-8 h-8 rounded bg-gray-500/10 border border-gray-500/10 overflow-hidden flex items-center justify-center">
                            {b.image ? (
                              <img
                                src={`http://localhost:5000${b.image}`}
                                className="w-full h-full object-cover"
                                alt="banner"
                              />
                            ) : (
                              <ImageIcon size={14} className="opacity-30" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() =>
                              handleToggleStatus(b._id, b.status)
                            }
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              b.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`cursor-pointer absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                b.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        {(bannerPermission?.edit ||
                          bannerPermission?.delete) ? (
                          <td className="px-4 py-2.5 text-right flex justify-end gap-1">
                            {/* EDIT */}
                            {bannerPermission?.edit ? (
                              <div className="relative group">
                                <button
                                  onClick={() => {
                                    setEditingBanner(b);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1.5 cursor-pointer hover:text-(--primary)"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-blue-400 text-[10px] px-2 py-2 rounded whitespace-nowrap pointer-events-none">
                                  Edit banner
                                </span>
                              </div>
                            ) : null}

                            {/* DELETE */}
                            {bannerPermission?.delete ? (
                              <div className="relative group">
                                <button
                                  onClick={() => handleDelete(b._id)}
                                  className="p-1.5 cursor-pointer hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-red-400 text-[10px] px-2 py-2 rounded whitespace-nowrap pointer-events-none">
                                  Delete banner
                                  <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
                                </span>
                              </div>
                            ) : null}
                          </td>
                        ) : null}
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
                Showing {processedBanners.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 cursor-pointer border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 cursor-pointer text-[11px] rounded-md border transition-all ${
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
                  className="p-1.5 border cursor-pointer rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
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
                    image: null,
                    isEdit: !!editingBanner,
                  }}
                  validationSchema={BannerSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const formData = new FormData();
                      formData.append("title", values.title);
                      formData.append("url", values.url);
                      formData.append("folder", "Banner");
                      if (values.image)
                        formData.append("image", values.image);

                      if (editingBanner) {
                        await updateItem(
                          `banner/${editingBanner._id}`,
                          formData
                        );
                      } else {
                        await createItem("banner", formData);
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
                  {({ setFieldValue, setFieldError, values }) => (
                    <Form className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Title{" "}
                          <span className="text-red-500 text-sm">*</span>
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
                        <ErrorMessage
                          name="url"
                          component="div"
                          className="text-red-500 text-[10px] mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Banner Image (200x200 px){" "}
                          <span className="text-red-500 text-sm">*</span>
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
                                setFieldError("image", err);
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