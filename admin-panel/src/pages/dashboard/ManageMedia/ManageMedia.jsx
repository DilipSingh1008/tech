import React, { useState } from "react";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "../../../redux/api/apiSlice.js";
import Searchbar from "../../../components/Searchbar";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import CommonImage from "../../../components/CommonImage";
import { Navigate } from "react-router-dom";

const ManageMedia = () => {
  const { isDarkMode } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    icon: null,
    id: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { data, isLoading } = useGetItemsQuery(
    `media-category?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`,
  );

  const media = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const [createItem, { isLoading: createLoading }] = useCreateItemMutation();
  const [updateItem, { isLoading: updateLoading }] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateItem({
        url: `media-category/${id}`,
        data: { status: !currentStatus },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media?")) return;
    try {
      await deleteItem(`media-category/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return alert("Title required");
    if (!formData.id && !formData.icon) return alert("Icon required");

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("folder", "media");

    if (!formData.id || formData.icon instanceof File) {
      payload.append("icon", formData.icon);
    }

    try {
      if (formData.id) {
        await updateItem({
          url: `media-category/${formData.id}`,
          data: payload,
        });
      } else {
        await createItem({
          url: "media-category",
          data: payload,
        });
      }

      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      icon: null,
      id: null,
    });
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

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-xs font-medium">
        Loading...
      </div>
    );

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
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
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <Plus size={14} /> Add Media
            </button>
          </div>

          <div
            className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-16">ID</th>

                    <th
                      onClick={() => handleSort("title")}
                      className="px-4 py-3 cursor-pointer"
                    >
                      Title
                    </th>

                    <th className="px-4 py-3 w-20">Icon</th>

                    <th className="px-4 py-3 w-24">Status</th>

                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {media.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 opacity-40">
                        No media found
                      </td>
                    </tr>
                  ) : (
                    media.map((item, index) => (
                      <tr key={item._id} className="hover:bg-indigo-500/5">
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + (index + 1)}
                        </td>

                        <td className="px-4 py-2.5 font-semibold text-sm">
                          {item.title}
                        </td>

                        <td className="px-4 py-2.5">
                          <div className="w-8 h-8 rounded bg-gray-500/10 border overflow-hidden">
                            <CommonImage
                              src={
                                item.icon
                                  ? `http://localhost:5000${item.icon}`
                                  : null
                              }
                              alt="media"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        <td className="px-4 py-2.5">
                          <button
                            onClick={() =>
                              handleToggleStatus(item._id, item.status)
                            }
                            className={`w-8 h-4 cursor-pointer rounded-full relative ${
                              item.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute cursor-pointer top-0.5 w-3 h-3 bg-white rounded-full ${
                                item.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setFormData({
                                  title: item.title,
                                  icon: `http://localhost:5000${item.icon}`,
                                  id: item._id,
                                });
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

            <div
              className={`flex items-center justify-between p-3 border-t ${theme.divider}`}
            >
              <span className="text-[11px] opacity-60">
                Showing {media.length} entries
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
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] cursor-pointer rounded-md border ${
                      page === i + 1 ? "bg-(--primary) text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5  cursor-pointer border rounded-md"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`w-full max-w-sm rounded-xl shadow-xl border ${
                  isDarkMode
                    ? "bg-[#151b28] border-gray-800 text-gray-200"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold">
                    {formData.id ? "Edit Media" : "Add Media"}
                  </h3>

                  <button
                    onClick={closeModal}
                    className="opacity-60 hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold opacity-50 mb-1">
                      Title
                    </label>

                    <input
                      type="text"
                      placeholder="Enter title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className={`w-full p-2 text-sm rounded-lg border outline-none ${
                        isDarkMode
                          ? "bg-[#0b0e14] border-gray-700 focus:border-(--primary)"
                          : "bg-gray-50 border-gray-300 focus:border-(--primary)"
                      }`}
                    />
                  </div>

                  {formData.icon && (
                    <div className="flex justify-center">
                      <CommonImage
                        src={
                          formData.icon instanceof File
                            ? URL.createObjectURL(formData.icon)
                            : formData.icon
                        }
                        className="w-16 h-16 object-cover rounded-lg border border-gray-500/20"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase font-bold opacity-50 mb-1">
                      Icon Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      required={!formData.id}
                      className="w-full cursor-pointer text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white "
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          icon: e.target.files[0],
                        })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createLoading || updateLoading}
                    className="w-full cursor-pointer py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {formData.id
                      ? updateLoading
                        ? "Updating..."
                        : "Update Media"
                      : createLoading
                        ? "Creating..."
                        : "Create Media"}
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

export default ManageMedia;
