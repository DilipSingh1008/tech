import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem,
} from "../../services/api";
import Searchbar from "../../components/Searchbar";
import { useSelector } from "react-redux";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const VendorPage = () => {
  const { isDarkMode } = useTheme();

  const [vendors, setVendors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("firmName");
  const [sortOrder, setSortOrder] = useState("asc");

  const permissions = useSelector((state) => state.permission.permissions);
  const rawPermission = permissions?.find((p) => p.module.name === "vendor");
  const localRole = localStorage.getItem("role");
  const vendorPermission =
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
    fetchVendors();
    fetchCountries();
  }, [page, searchQuery, sortField, sortOrder]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await getItems(
        `vendors?page=${page}&limit=${limit}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      setVendors(res.data || []);
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
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteItem(`vendors/${id}`);
      fetchVendors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await patchItem(`vendors/toggle-status/${id}`, {});
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: !currentStatus } : v))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const VendorSchema = Yup.object().shape({
    firmName: Yup.string().required("Firm name is required"),
    gst: Yup.string()
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Enter valid GST number"
      )
      .required("GST number is required"),
    contactName: Yup.string().required("Contact name is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter valid 10 digit number")
      .required("Mobile is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
  });

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            {vendorPermission?.add && (
              <button
                onClick={() => {
                  setEditingVendor(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
              >
                <Plus size={14} /> Add Vendor
              </button>
            )}
          </div>

          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`uppercase tracking-wider font-bold ${theme.header}`}>
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("firmName")}
                    >
                      Firm Name
                      <span className="opacity-50 text-[10px]">
                        {sortField === "firmName"
                          ? sortOrder === "asc" ? "▲" : "▼"
                          : "↕"}
                      </span>
                    </th>
                    <th className="px-4 py-3">GST</th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("contactName")}
                    >
                      Contact Name
                      <span className="opacity-50 text-[10px]">
                        {sortField === "contactName"
                          ? sortOrder === "asc" ? "▲" : "▼"
                          : "↕"}
                      </span>
                    </th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    {(vendorPermission?.edit || vendorPermission?.delete) && (
                      <th className="px-4 py-3 text-right">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.divider}`}>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6 opacity-40 italic">
                        Loading...
                      </td>
                    </tr>
                  ) : vendors.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6 opacity-40">
                        No vendors found.
                      </td>
                    </tr>
                  ) : (
                    vendors.map((v, index) => (
                      <tr key={v._id} className="hover:bg-indigo-500/5 transition-colors">
                        <td className="px-4 py-2.5">{index + 1}</td>
                        <td className="px-4 py-2.5">{v.firmName}</td>
                        <td className="px-4 py-2.5 uppercase">{v.gst}</td>
                        <td className="px-4 py-2.5">{v.contactName}</td>
                        <td className="px-4 py-2.5">{v.mobile}</td>
                        <td className="px-4 py-2.5">
                          {v.city}, {v.state}, {v.country}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(v._id, v.status)}
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              v.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                v.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>
                        {(vendorPermission?.edit || vendorPermission?.delete) && (
                          <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                            {vendorPermission?.edit && (
                              <button
                                onClick={() => {
                                  setEditingVendor(v);
                                  setIsModalOpen(true);
                                }}
                                className="hover:text-(--primary) cursor-pointer"
                              >
                                <Edit3 size={14} />
                              </button>
                            )}
                            {vendorPermission?.delete && (
                              <button
                                onClick={() => handleDelete(v._id)}
                                className="hover:text-red-500 cursor-pointer"
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
            <div className={`flex items-center justify-between p-3 border-t ${theme.divider}`}>
              <span className="text-[11px] opacity-60">
                Showing {vendors.length} entries
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
                } p-5 rounded-xl w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto`}
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-sm font-bold">
                    {editingVendor ? "Edit Vendor" : "New Vendor"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    firmName: editingVendor?.firmName || "",
                    gst: editingVendor?.gst || "",
                    contactName: editingVendor?.contactName || "",
                    mobile: editingVendor?.mobile || "",
                    address: editingVendor?.address || "",
                    country: editingVendor?.country || "",
                    state: editingVendor?.state || "",
                    city: editingVendor?.city || "",
                  }}
                  validationSchema={VendorSchema}
                  enableReinitialize
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      if (editingVendor) {
                        await updateItem(`vendors/${editingVendor._id}`, values);
                      } else {
                        await createItem("vendors", values);
                      }
                      setIsModalOpen(false);
                      fetchVendors();
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-3">
                      {/* Firm Name */}
                      <div>
                        <Field
                          name="firmName"
                          placeholder="Firm Name"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        />
                        <ErrorMessage name="firmName" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* GST */}
                      <div>
                        <Field
                          name="gst"
                          placeholder="GST Number"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 uppercase"
                        />
                        <ErrorMessage name="gst" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Contact Name */}
                      <div>
                        <Field
                          name="contactName"
                          placeholder="Contact Name"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        />
                        <ErrorMessage name="contactName" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Mobile */}
                      <div>
                        <Field
                          name="mobile"
                          placeholder="Mobile"
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        />
                        <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Address */}
                      <div>
                        <Field
                          as="textarea"
                          name="address"
                          placeholder="Address"
                          rows={2}
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 resize-none"
                        />
                        <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Country */}
                      <div>
                        <Field
                          as="select"
                          name="country"
                          onChange={(e) => {
                            const selected = countries.find((c) => c._id === e.target.value);
                            setFieldValue("country", selected?.name?.toLowerCase() || "");
                            setFieldValue("state", "");
                            setFieldValue("city", "");
                            fetchStates(e.target.value);
                          }}
                          value={
                            countries.find(
                              (c) => c.name?.toLowerCase() === values.country
                            )?._id || ""
                          }
                          className="w-full p-2 text-sm rounded-lg border border-gray-300"
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="country" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* State */}
                      <div>
                        <Field
                          as="select"
                          name="state"
                          disabled={!values.country}
                          onChange={(e) => {
                            const selected = states.find((s) => s._id === e.target.value);
                            setFieldValue("state", selected?.name?.toLowerCase() || "");
                            setFieldValue("city", "");
                            fetchCities(e.target.value);
                          }}
                          value={
                            states.find(
                              (s) => s.name?.toLowerCase() === values.state
                            )?._id || ""
                          }
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 disabled:bg-gray-300"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="state" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* City */}
                      <div>
                        <Field
                          as="select"
                          name="city"
                          disabled={!values.state}
                          onChange={(e) => {
                            const selected = cities.find((c) => c._id === e.target.value);
                            setFieldValue("city", selected?.name?.toLowerCase() || "");
                          }}
                          value={
                            cities.find(
                              (c) => c.name?.toLowerCase() === values.city
                            )?._id || ""
                          }
                          className="w-full p-2 text-sm rounded-lg border border-gray-300 disabled:bg-gray-300"
                        >
                          <option value="">Select City</option>
                          {cities.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="city" component="div" className="text-red-500 text-xs" />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer py-2 bg-(--primary) text-white rounded-lg text-xs font-bold disabled:opacity-60"
                      >
                        {editingVendor ? "Update Vendor" : "Create Vendor"}
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

export default VendorPage;