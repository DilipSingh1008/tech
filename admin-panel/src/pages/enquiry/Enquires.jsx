import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiXCircle,
  FiUser,
  FiTag,
  FiSettings,
  FiCalendar,
  FiPlusCircle,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import {
  useGetItemsQuery,
  useCreateItemMutation,
} from "../../redux/api/apiSlice.js";
import Searchbar from "../../components/Searchbar";

const TYPE_COLORS = {
  Support: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Sales: "text-green-400 bg-green-400/10 border-green-400/20",
  Billing: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  General: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const LIMIT = 5;

const enquirySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name too short")
    .max(50, "Name too long")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  mobile: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Mobile must be exactly 10 digits")
    .required("Mobile number is required"),
  message: Yup.string()
    .trim()
    .min(10, "Message too short (min 10 chars)")
    .max(500, "Message too long")
    .required("Message is required"),
});

const Enquires = () => {
  const { isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mobile search autocomplete — stays local (user-driven, not paginated)
  const [mobileSearch, setMobileSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // ── RTK Query: fetch enquiries ────────────────────────────────────────────
  const { data, isLoading } = useGetItemsQuery(
    `enquiry?page=${page}&limit=${LIMIT}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`,
  );
  const enquiriesData = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // ── RTK Query: mobile autocomplete search ─────────────────────────────────
  const { data: mobileData } = useGetItemsQuery(
    `enquiry/search-mobile-number?mobile=${mobileSearch}`,
    { skip: mobileSearch.length < 3 },
  );
  const mobileResults = mobileData || [];

  // ── RTK Query: mutations ──────────────────────────────────────────────────
  const [createItem] = useCreateItemMutation();

  // ── Sort ──────────────────────────────────────────────────────────────────
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

  // ── Submit enquiry ────────────────────────────────────────────────────────
  const handleSubmitEnquiry = async (values, { resetForm, setSubmitting }) => {
    try {
      await createItem({ url: "enquiry", data: values }).unwrap();
      resetForm();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
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
    input: isDarkMode
      ? "bg-gray-500/5 border-gray-500/20 text-white"
      : "bg-gray-50 border-gray-300 text-gray-900",
    modal: isDarkMode ? "bg-[#151b28] text-white" : "bg-white text-gray-800",
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
    borderT: isDarkMode ? "border-gray-800" : "border-gray-100",
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
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <FiPlusCircle size={14} /> Add Enquiry
            </button>
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
                    <th className="px-4 py-3 w-14">ID</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Client Name <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-1">
                        Email <SortIcon field="email" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("mobile")}
                    >
                      <div className="flex items-center gap-1">
                        Mobile <SortIcon field="mobile" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("service_id")}
                    >
                      <div className="flex items-center gap-1">
                        Service Name <SortIcon field="service_id" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-1">
                        Type <SortIcon field="type" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date <SortIcon field="date" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : enquiriesData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No enquiries found.
                      </td>
                    </tr>
                  ) : (
                    enquiriesData.map((enquiry, index) => (
                      <tr
                        key={enquiry._id}
                        className="hover:bg-(--primary)/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * LIMIT + (index + 1)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <FiUser size={11} className="opacity-40" />
                            <span className="font-semibold">
                              {enquiry.client?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <FiMail size={11} className="shrink-0" />
                            <span className="text-[11px]">
                              {enquiry.client?.email || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <FiPhone size={11} className="shrink-0" />
                            <span className="text-[11px]">
                              {enquiry.client?.mobile || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <FiSettings size={11} className="opacity-40" />
                            <span className="font-mono text-[11px]">
                              {enquiry.service_id || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${TYPE_COLORS[enquiry.type] || "text-gray-400 bg-gray-400/10 border-gray-400/20"}`}
                          >
                            <FiTag size={9} />
                            {enquiry.type || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <FiCalendar size={11} />
                            <span>
                              {new Date(enquiry.enquiryDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-(--primary)/40 text-(--primary) hover:bg-(--primary)/10 transition-all cursor-pointer text-[11px] font-semibold"
                          >
                            <FiMessageSquare size={11} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`flex items-center justify-between p-3 border-t ${theme.borderT}`}
            >
              <span className="text-[11px] opacity-60">
                Showing {enquiriesData.length} entries
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

      {/* Message Popup Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className={`${theme.modal} p-5 rounded-xl w-full max-w-sm shadow-xl border border-gray-700/30`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FiMessageSquare size={15} className="text-(--primary)" />
                <h3 className="text-sm font-bold">Enquiry Message</h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="opacity-50 cursor-pointer hover:text-(--primary) hover:opacity-100 transition-all"
              >
                <FiXCircle size={16} />
              </button>
            </div>

            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-2 mb-4 pb-4 border-b ${theme.borderT}`}
            >
              <span className="flex items-center gap-1.5 text-[10px] opacity-60 truncate">
                <FiUser size={10} className="shrink-0" />{" "}
                {selectedEnquiry.client?.name || "N/A"}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] opacity-60 truncate">
                <FiSettings size={10} className="shrink-0" />{" "}
                {selectedEnquiry.service_id || "N/A"}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] opacity-60 truncate">
                <FiMail size={10} className="shrink-0" />{" "}
                {selectedEnquiry.email || "N/A"}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] opacity-60 truncate">
                <FiPhone size={10} className="shrink-0" />{" "}
                {selectedEnquiry.mobile || "N/A"}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] opacity-60">
                <FiCalendar size={10} className="shrink-0" />
                {new Date(selectedEnquiry.enquiryDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                )}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold w-fit ${TYPE_COLORS[selectedEnquiry.type] || "text-gray-400 bg-gray-400/10 border-gray-400/20"}`}
              >
                <FiTag size={9} /> {selectedEnquiry.type || "N/A"}
              </span>
            </div>

            <p className="text-sm leading-relaxed opacity-80">
              {selectedEnquiry.message}
            </p>
          </div>
        </div>
      )}

      {/* Add Enquiry Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className={`${theme.modal} p-5 rounded-xl w-full max-w-sm shadow-xl border border-gray-700/30`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FiPlusCircle size={15} className="text-(--primary)" />
                <h3 className="text-sm font-bold">Add Enquiry</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="opacity-50 cursor-pointer hover:text-(--primary) hover:opacity-100 transition-all"
              >
                <FiXCircle size={16} />
              </button>
            </div>

            <Formik
              initialValues={{ name: "", email: "", mobile: "", message: "" }}
              validationSchema={enquirySchema}
              onSubmit={handleSubmitEnquiry}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="space-y-3" noValidate>
                  {/* Mobile */}
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <FiPhone
                        size={12}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                      />
                      <Field name="mobile">
                        {({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                            className={`w-full pl-7 pr-3 py-2 text-sm rounded-lg border ${theme.input}`}
                            onChange={(e) => {
                              field.onChange(e);
                              const val = e.target.value;
                              setMobileSearch(val);
                              setShowDropdown(val.length >= 3);
                            }}
                          />
                        )}
                      </Field>
                      {showDropdown && mobileResults.length > 0 && (
                        <div className="absolute w-full bg-black border rounded-md mt-1 max-h-40 overflow-y-auto z-50">
                          {mobileResults.map((client) => (
                            <div
                              key={client._id}
                              className="p-2 hover:bg-blue-400 border border-0 border-black text-white cursor-pointer text-sm"
                              onClick={() => {
                                setFieldValue("name", client.name);
                                setFieldValue("email", client.email);
                                setFieldValue("mobile", client.mobile);
                                setShowDropdown(false);
                              }}
                            >
                              {client.mobile} - {client.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      name="mobile"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 block"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <FiUser
                        size={12}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                      />
                      <Field
                        name="name"
                        placeholder="Enter your name"
                        className={`w-full pl-7 pr-3 py-2 text-sm rounded-lg border outline-none focus:border-(--primary) transition-all ${theme.input} ${errors.name && touched.name ? "border-red-500" : ""}`}
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 block"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail
                        size={12}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                      />
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`w-full pl-7 pr-3 py-2 text-sm rounded-lg border outline-none focus:border-(--primary) transition-all ${theme.input} ${errors.email && touched.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 block"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Message
                    </label>
                    <Field
                      as="textarea"
                      name="message"
                      rows={3}
                      placeholder="Write your message..."
                      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-(--primary) transition-all resize-none ${theme.input} ${errors.message && touched.message ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage
                      name="message"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 block"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquires;
