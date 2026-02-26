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
import { useNavigate } from "react-router-dom";

const ManageRole = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    fetchRoles();
  }, [page, searchQuery, sortBy, order]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getItems(
        `role?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=${sortBy}&order=${order}`,
      );
      setRoles(res.data || []);
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
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteItem(`role/${id}`);
      fetchRoles();
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    await updateItem(`role/${id}`, { status: !currentStatus });
    setRoles((prev) =>
      prev.map((role) =>
        role._id === id ? { ...role, status: !currentStatus } : role,
      ),
    );
  };

  const RoleSchema = Yup.object().shape({
    name: Yup.string().required("Role name is required"),
  });

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => {
                setEditingRole(null);
                setIsModalOpen(true);
              }}
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <Plus size={14} /> Add Role
            </button>
          </div>

          {/* Table */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`uppercase tracking-wider font-bold ${theme.header}`}>
                  <tr>
                    <th className="px-4 py-3 w-20">ID</th>

                    {/* ── Sortable: Role Name ── */}
                    <th
                      className="px-4 py-3 cursor-pointer w-[100px] hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Role Name <SortIcon field="name" />
                      </div>
                    </th>
                     <th className="px-4 py-3 w-24" onClick={() => navigate("/dashboard/manage-permissio")}>Permissions</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 opacity-40 italic">
                        Loading...
                      </td>
                    </tr>
                  ) : roles.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 opacity-40">
                        No roles found.
                      </td>
                    </tr>
                  ) : (
                    roles.map((role, index) => (
                      <tr
                        key={role._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + index + 1}
                        </td>

                        <td className="px-4 py-2.5 font-semibold text-sm capitalize">
                          {role.name}
                        </td>

                         <td className="px-4 py-2.5 hover:text-blue-400 font-semibold cursor-pointer text-sm capitalize" onClick={() => navigate("/dashboard/manage-permission")}>
                          Manage
                        </td>

                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(role._id, role.status)}
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              role.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                role.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-2.5 text-right flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingRole(role);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 cursor-pointer hover:text-(--primary) transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(role._id)}
                            className="p-1.5 cursor-pointer hover:text-red-500 transition-colors"
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
            <div className={`flex items-center justify-between p-3 border-t ${theme.divider}`}>
              <span className="text-[11px] opacity-60">
                Showing {roles.length} entries
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 cursor-pointer border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
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
                  className="p-1.5 cursor-pointer border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
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
                    {editingRole ? "Edit Role" : "New Role"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="opacity-50 cursor-pointer hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{ name: editingRole?.name || "" }}
                  validationSchema={RoleSchema}
                  onSubmit={async (values) => {
                    if (editingRole) {
                      await updateItem(`role/${editingRole._id}`, values);
                    } else {
                      await createItem("role", values);
                    }
                    setIsModalOpen(false);
                    fetchRoles();
                  }}
                >
                  <Form className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                        Role Name *
                      </label>
                      <Field
                        name="name"
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-[10px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full cursor-pointer py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold transition-all"
                    >
                      {editingRole ? "Update Role" : "Create Role"}
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

export default ManageRole;