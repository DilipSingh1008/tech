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
  patchItem,
} from "../../../services/api";
import Searchbar from "../../../components/Searchbar";
import { useSelector } from "react-redux";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const ClientPage = () => {
  const { isDarkMode } = useTheme();

  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const permissions = useSelector((state) => state.permission.permissions);
  const rawPermission = permissions?.find((p) => p.module.name === "client");
  const localRole = localStorage.getItem("role");
  const clientPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawPermission;

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
    fetchClients();
    fetchCountries();
  }, [page, searchQuery, sortField, sortOrder]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getItems(
        `client?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
      );
      console.log(res);
      setClients(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await getItems("countrylocation");
      setCountries(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      setCities([]);
      return;
    }
    try {
      const res = await getItems(`statelocation/${countryId}`);
      setStates(res.data || []);
      setCities([]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      const res = await getItems(`statelocation/${stateId}/all-cities`);
      setCities(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- Sorting -------------------
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
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteItem(`client/${id}`);
      fetchClients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await patchItem(`client/toggle-status/${id}`, {});
      setClients((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: !currentStatus } : c)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const ClientSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Enter valid email")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter valid 10 digit number")
      .required("Mobile is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
  });

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            {clientPermission?.add && (
              <button
                onClick={() => {
                  setEditingClient(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
              >
                <Plus size={14} /> Add Client
              </button>
            )}
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
                    <th className="px-4 py-3">ID</th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <span className="opacity-50 text-[10px]">
                        {sortField === "name"
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      <span className="opacity-50 text-[10px]">
                        {sortField === "email"
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    </th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    {(clientPermission?.edit || clientPermission?.delete) && (
                      <th className="px-4 py-3 text-right">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.divider}`}>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 opacity-40">
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    clients.map((c, index) => (
                      <tr
                        key={c._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5">{index++}</td>
                        <td className="px-4 py-2.5">{c.name}</td>
                        <td className="px-4 py-2.5">{c.email}</td>
                        <td className="px-4 py-2.5">{c.mobile}</td>
                        <td className="px-4 py-2.5">
                          {c.city?.name}, {c.state?.name}, {c.country?.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(c._id, c.status)}
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              c.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                c.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>
                        {(clientPermission?.edit ||
                          clientPermission?.delete) && (
                          <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                            {clientPermission?.edit && (
                              <button
                                onClick={() => {
                                  setEditingClient(c);
                                  setIsModalOpen(true);
                                }}
                                className="hover:text-(--primary)"
                              >
                                <Edit3 size={14} />
                              </button>
                            )}
                            {clientPermission?.delete && (
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
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
                Showing {clients.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="cursor-pointer p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
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
                  disabled={page === totalPages}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`${
                  isDarkMode ? "bg-[#151b28] text-white" : "bg-white"
                } p-5 rounded-xl w-full max-w-xs shadow-xl`}
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-sm font-bold">
                    {editingClient ? "Edit Client" : "New Client"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    name: editingClient?.name || "",
                    email: editingClient?.email || "",
                    mobile: editingClient?.mobile || "",
                    country: editingClient?.country?._id || "",
                    state: editingClient?.state?._id || "",
                    city: editingClient?.city?._id || "",
                  }}
                  validationSchema={ClientSchema}
                  enableReinitialize
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      if (editingClient) {
                        await updateItem(`client/${editingClient._id}`, values);
                      } else {
                        await createItem("client", values);
                      }
                      setIsModalOpen(false);
                      fetchClients();
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="space-y-3">
                      {/* Name */}
                      <div>
                        <Field
                          name="name"
                          placeholder="Name"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <Field
                          name="email"
                          placeholder="Email"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <Field
                          name="mobile"
                          placeholder="Mobile"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <Field
                          as="select"
                          name="country"
                          onChange={(e) => {
                            setFieldValue("country", e.target.value);
                            setFieldValue("state", "");
                            setFieldValue("city", "");
                            fetchStates(e.target.value);
                          }}
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <Field
                          as="select"
                          name="state"
                          disabled={!values.country}
                          onChange={(e) => {
                            setFieldValue("state", e.target.value);
                            setFieldValue("city", "");
                            fetchCities(e.target.value);
                          }}
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 disabled:bg-gray-300"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <Field
                          as="select"
                          name="city"
                          disabled={!values.state}
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 disabled:bg-gray-300"
                        >
                          <option value="">Select City</option>
                          {cities.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-(--primary) text-white rounded-lg text-xs font-bold"
                      >
                        {editingClient ? "Update Client" : "Create Client"}
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

export default ClientPage;
