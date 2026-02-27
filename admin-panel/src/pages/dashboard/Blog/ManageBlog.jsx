import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import { getItems, deleteItem, patchItem } from "../../../services/api";
import Searchbar from "../../../components/Searchbar";
import { useNavigate } from "react-router-dom";

const ManageBlog = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border border-gray-800 text-white"
      : "bg-white border border-gray-200 text-gray-700",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-500",
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
  };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchData();
  }, [page, sortBy, order, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getItems(
        `blogs?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`,
      );
      console.log(res);

      setBlogs(res.data || []);
      if (res.totalPages) setTotalPages(res.totalPages);
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

  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px]">
      {sortBy === field ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  const handleStatusToggle = async (id) => {
    try {
      await patchItem(`blogs/status/${id}`);
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: !b.status } : b)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`blogs/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <button
                onClick={() => navigate("/dashboard/manage-blog/add")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90 w-full sm:w-auto"
              >
                <Plus size={16} /> Add New Blog
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`${theme.card} rounded-xl overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px] md:min-w-full">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-10">ID</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Title <SortIcon field="title" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 hidden sm:table-cell cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("shortDescription")}
                    >
                      Short Description <SortIcon field="shortDescription" />
                    </th>
                    <th
                      className="px-4 py-3 hidden lg:table-cell cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("mainDescription")}
                    >
                      Description <SortIcon field="mainDescription" />
                    </th>
                    <th
                      className="px-4 py-3 hidden md:table-cell cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      Date <SortIcon field="createdAt" />
                    </th>
                    <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 w-16">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : blogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No blogs found.
                      </td>
                    </tr>
                  ) : (
                    blogs.map((item, index) => (
                      <tr
                        key={item._id}
                        className="hover:bg-(--primary)/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold">
                          {item.title}
                        </td>
                        <td className="px-4 py-2.5 opacity-70 hidden sm:table-cell">
                          {item.shortDescription?.length > 30
                            ? item.shortDescription.substring(0, 30) + "..."
                            : item.shortDescription}
                        </td>
                        <td className="px-4 py-2.5 opacity-70 hidden lg:table-cell">
                          {item.mainDescription
                            ? item.mainDescription
                                .replace(/<[^>]+>/g, "")
                                .substring(0, 30) + "..."
                            : "-"}
                        </td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell">
                          {item.categoryId?.name || "-"}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleStatusToggle(item._id)}
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
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/Manage-Blog/edit/${item._id}`,
                                )
                              }
                              className="p-1.5 cursor-pointer hover:text-(--primary) hover:bg-(--primary)/10 rounded-md transition-all"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-30"
                              title="Delete"
                              disabled={deleteLoading}
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
              className={`flex flex-col sm:flex-row items-center justify-between p-3 border-t ${theme.divider} gap-2 sm:gap-0`}
            >
              <span className="text-[11px] opacity-60">
                Showing {blogs.length} entries
              </span>
              <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] rounded-md border transition-all cursor-pointer ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary) shadow-sm"
                        : "hover:border-(--primary) hover:text-(--primary) border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageBlog;
