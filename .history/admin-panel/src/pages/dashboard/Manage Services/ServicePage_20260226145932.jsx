import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Plus, Trash2, Edit3 } from "lucide-react";
import {
  getItems,
  deleteItem,
  patchItem,
} from "../../../services/api";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";
import { useNavigate } from "react-router-dom";

const ManageServicesPage = () => {
  const { isDarkMode } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // ── Sorting states ──
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

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

  // Re-fetch when page, search, sortBy, or order changes
  useEffect(() => {
    fetchServices();
  }, [page, searchQuery, sortBy, order]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getItems(
        `services?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=${sortBy}&order=${order}`,
      );
      setServices(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Sort handler ──
  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
    setPage(1);
  };

  // ── Sort icon helper ──
  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px] ml-1">
      {sortBy === field ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      await deleteItem(`services/${id}`);
      fetchServices();
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await patchItem(`services/togal/${id}`, {});
      fetchServices();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => navigate("/dashboard/service/add")}
              className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold w-full sm:w-auto"
            >
              <Plus size={14} /> Add Service
            </button>
          </div>

          {/* Table */}
          <div className={`rounded-xl border shadow-sm overflow-x-auto ${theme.card}`}>
            <table className="min-w-[900px] w-full text-xs">
              <thead className={`uppercase font-bold ${theme.header}`}>
                <tr>
                  <th className="px-2 py-3 text-left whitespace-nowrap">ID</th>

                  {/* ── Sortable: Name ── */}
                  <th
                    className="px-2 py-3 text-left whitespace-nowrap cursor-pointer hover:text-(--primary) transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Name <SortIcon field="name" />
                  </th>

                  {/* ── Sortable: Slug ── */}
                  <th
                    className="px-2 py-3 text-left whitespace-nowrap cursor-pointer hover:text-(--primary) transition-colors"
                    onClick={() => handleSort("slug")}
                  >
                    Slug <SortIcon field="slug" />
                  </th>

                  {/* ── Sortable: Category ── */}
                  <th
                    className="px-2 py-3 text-left whitespace-nowrap cursor-pointer hover:text-(--primary) transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    Category <SortIcon field="category" />
                  </th>

                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    SubCategory
                  </th>

                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    Short Desc
                  </th>

                  {/* ── Sortable: Status ── */}
                  <th
                    className="px-2 py-3 text-left whitespace-nowrap cursor-pointer hover:text-(--primary) transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    Status <SortIcon field="status" />
                  </th>

                  <th className="px-2 py-3 text-right whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 opacity-50">
                      Loading...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 opacity-40">
                      No services found.
                    </td>
                  </tr>
                ) : (
                  services.map((s, index) => (
                    <tr
                      key={s._id}
                      className="border-t hover:bg-gray-100 dark:hover:bg-[#1a2030]"
                    >
                      <td className="px-2 py-2 whitespace-nowrap">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td
                        className="px-2 py-2 whitespace-nowrap truncate max-w-[150px]"
                        title={s.name}
                      >
                        {s.name}
                      </td>

                      <td
                        className="px-2 py-2 whitespace-nowrap truncate max-w-[120px]"
                        title={s.slug}
                      >
                        {s.slug}
                      </td>

                      <td className="px-2 py-2 whitespace-nowrap">
                        {s.category?.name || "-"}
                      </td>

                      <td className="px-2 py-2 whitespace-nowrap">
                        {s.subCategory?.name || "-"}
                      </td>

                      <td
                        className="px-2 py-2 whitespace-nowrap truncate max-w-[180px]"
                        title={s.shortDescription}
                      >
                        {s.shortDescription}
                      </td>

                      <td className="px-2 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(s._id, s.status)}
                          className={`w-8 h-4 rounded-full relative cursor-pointer ${
                            s.status ? "bg-(--primary)" : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                              s.status ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>

                     <td className="px-4 py-2.5 text-right">
  <div className="flex justify-end gap-4">

    {/* EDIT */}
    <div className="relative group">
      <button
        onClick={() => navigate(`/dashboard/service/edit/${s._id}`)}
        className="cursor-pointer p-1.5 text-gray-400 hover:text-(--primary) transition-colors"
      >
        <Edit3 size={14} />
      </button>

      <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-blue-400 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
        Edit service
        <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
      </span>
    </div>

    {/* DELETE */}
    <div className="relative group">
      <button
        onClick={() => handleDelete(s._id)}
        className="cursor-pointer p-1.5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={14} />
      </button>

      <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-red-400 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
        Delete service
        <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
      </span>
    </div>

  </div>
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`flex items-center justify-between p-3 border-t ${theme.divider}`}>
            <span className="text-[11px] opacity-60">
              Showing {services.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1 || loading}
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
                disabled={page === totalPages || loading}
                onClick={() => setPage(page + 1)}
                className="p-1.5 border cursor-pointer rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ManageServicesPage;