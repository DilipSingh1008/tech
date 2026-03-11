import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiPlusCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import {
  useGetItemsQuery,
  useDeleteItemMutation,
  usePatchItemMutation,
} from "../../../redux/api/apiSlice.js";
import Searchbar from "../../../components/Searchbar";
import { useSelector } from "react-redux";

const Cms = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // ── Permission Logic ──
  const permissions = useSelector((state) => state.permission.permissions);
  const rawCmsPermission = permissions?.find((p) => p.module.name === "cms");
  const localRole = localStorage.getItem("role");
  const cmsPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawCmsPermission;

  // ── RTK Query: fetch ──
  const { data, isLoading } = useGetItemsQuery(
    `cms?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`,
  );

  const cmsData = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // ── RTK Query: mutations ──
  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
  const [patchItem] = usePatchItemMutation();

  // ── Sort ──
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

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      await deleteItem(`cms/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ── Toggle Status ──
  const handleToggle = async (cmsId, currentStatus) => {
    try {
      await patchItem({
        url: `cms/toggle/${cmsId}`,
        data: { status: !currentStatus },
      });
    } catch (err) {
      console.error(err);
    }
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
            {cmsPermission?.add && (
              <button
                onClick={() => navigate("/dashboard/add-cms")}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <FiPlusCircle size={14} /> Add CMS
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
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Title <SortIcon field="title" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("slug")}
                    >
                      <div className="flex items-center gap-1">
                        Slug <SortIcon field="slug" />
                      </div>
                    </th>
                    <th className="px-4 py-3 w-24">Status</th>
                    {(cmsPermission?.edit || cmsPermission?.delete) && (
                      <th className="px-4 py-3 text-right w-24">Action</th>
                    )}
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : cmsData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No CMS pages found.
                      </td>
                    </tr>
                  ) : (
                    cmsData.map((page_, index) => (
                      <tr
                        key={page_._id}
                        className="hover:bg-(--primary)/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + (index + 1)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-sm">
                          {page_.title}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] opacity-60">
                          /{page_.slug}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() =>
                              handleToggle(page_._id, page_.status)
                            }
                            className={`relative inline-flex cursor-pointer h-5 w-9 items-center rounded-full transition-colors ${
                              page_.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                page_.status ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>

                        {(cmsPermission?.edit || cmsPermission?.delete) && (
                          <td className="px-4 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              {cmsPermission?.edit && (
                                <div className="relative group">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/edit-cms/${page_._id}`,
                                      )
                                    }
                                    className="p-1.5 text-gray-400 cursor-pointer hover:text-(--primary) hover:bg-(--primary)/10 rounded-md transition-all"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-blue-400 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                                    Edit page
                                    <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
                                  </span>
                                </div>
                              )}

                              {cmsPermission?.delete && (
                                <div className="relative group">
                                  <button
                                    onClick={() => handleDelete(page_._id)}
                                    disabled={deleteLoading}
                                    className="p-1.5 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-30"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                  <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-red-400 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                                    {deleteLoading
                                      ? "Deleting..."
                                      : "Delete page"}
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
                Showing {cmsData.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
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
                  disabled={page === totalPages || isLoading}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
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

export default Cms;
