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
import Searchbar from "../../../components/Searchbar";
import { useSelector } from "react-redux";

const ClientPage = () => {
  const { isDarkMode } = useTheme();

  // Data
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Permissions
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
  };

  // ------------------- FETCH DATA -------------------
  useEffect(() => {
    fetchClients();
    fetchCountries();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getItems("client"); // backend should populate country, state, city
      setClients(res.data || []);
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
      console.error("Error fetching countries", err);
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
      console.error("Error fetching states", err);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      const res = await getItems(`statelocation/${stateId}/all-cities`);
      console.log(res);
      setCities(res.data || []);
    } catch (err) {
      console.error("Error fetching cities", err);
    }
  };

  // ------------------- DELETE CLIENT -------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteItem(`client/${id}`);
      setClients(clients.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- FORM VALIDATION -------------------
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

  // Filtered clients
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs font-medium">
        Loading...
      </div>
    );

  // ------------------- RENDER -------------------
  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
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

          {/* Client Table */}
          <div
            className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead className={`uppercase font-bold ${theme.header}`}>
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Location</th>
                  {(clientPermission?.edit || clientPermission?.delete) && (
                    <th className="px-4 py-3 text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 opacity-40">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((c) => (
                    <tr key={c._id} className="hover:bg-indigo-500/5">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">{c.mobile}</td>
                      <td className="px-4 py-2">
                        {c.city?.name}, {c.state?.name}, {c.country?.name}
                      </td>
                      {(clientPermission?.edit || clientPermission?.delete) && (
                        <td className="px-4 py-2 text-right flex justify-end gap-2">
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

          {/* Modal Form */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`${isDarkMode ? "bg-[#151b28] text-white" : "bg-white"} p-5 rounded-xl w-full max-w-xs shadow-xl`}
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
                      <Field
                        name="name"
                        placeholder="Name"
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs"
                      />

                      {/* Email */}
                      <Field
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs"
                      />

                      {/* Mobile */}
                      <Field
                        name="mobile"
                        placeholder="Mobile"
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20"
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-red-500 text-xs"
                      />

                      {/* Country */}
                      <Field
                        as="select"
                        name="country"
                        onChange={(e) => {
                          setFieldValue("country", e.target.value);
                          setFieldValue("state", "");
                          setFieldValue("city", "");
                          fetchStates(e.target.value);
                        }}
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20"
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

                      {/* State */}
                      <Field
                        as="select"
                        name="state"
                        disabled={!values.country}
                        onChange={(e) => {
                          setFieldValue("state", e.target.value);
                          setFieldValue("city", "");
                          fetchCities(e.target.value);
                        }}
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 disabled:bg-gray-300"
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

                      {/* City */}
                      <Field
                        as="select"
                        name="city"
                        disabled={!values.state}
                        className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 disabled:bg-gray-300"
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
