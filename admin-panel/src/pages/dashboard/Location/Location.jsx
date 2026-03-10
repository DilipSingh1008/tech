import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiPlusCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  usePatchItemMutation,
} from "../../../redux/api/apiSlice.js";
import Searchbar from "../../../components/Searchbar";
import { useSelector } from "react-redux";

const Location = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  // ── Permission Logic ──
  const permissions = useSelector((state) => state.permission.permissions);
  const rawLocationPermission = permissions?.find(
    (p) => p.module.name === "location",
  );
  const localRole = localStorage.getItem("role");
  const locationPermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawLocationPermission;

  // ── RTK Query: fetch ──
  const { data, isLoading } = useGetItemsQuery(
    `countrylocation?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`,
  );

  const countriesData = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // ── RTK Query: mutations ──
  const [createItem, { isLoading: createLoading }] = useCreateItemMutation();
  const [updateItem, { isLoading: updateLoading }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
  const [patchItem] = usePatchItemMutation();

  // ── Sort ──
  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
    setPage(1);
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country?"))
      return;
    await deleteItem(`countrylocation/${id}/delete-country`);
  };

  // ── Toggle Status ──
  const handleToggle = async (countryId, currentStatus) => {
    await patchItem({
      url: `countrylocation/${countryId}/toggle-status`,
      data: { isActive: !currentStatus },
    });
  };

  // ── Modal helpers ──
  const openAddModal = () => {
    setEditingCountry(null);
    setIsModalOpen(true);
  };
  const openEditModal = (country) => {
    setEditingCountry(country);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCountry(null);
  };

  // ── Submit ──
  const submitCountryFunction = async (
    values,
    { resetForm, setSubmitting },
  ) => {
    const payload = { country: values.countryName.trim() };
    try {
      if (editingCountry) {
        await updateItem({
          url: `countrylocation/${editingCountry._id}/edit-country`,
          data: payload,
        });
      } else {
        await createItem({ url: "countrylocation", data: payload });
      }
      resetForm();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    countryName: Yup.string()
      .trim()
      .min(2, "Too short")
      .max(50, "Too long")
      .required("Country name is required"),
  });

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
            {locationPermission?.add && (
              <button
                onClick={openAddModal}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <FiPlusCircle size={14} /> Add Country
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
                    <th className="px-4 py-3 w-16">id</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Country Name
                        <span className="opacity-50 text-[10px]">
                          {sortBy === "name"
                            ? order === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 w-24">Status</th>
                    {(locationPermission?.edit ||
                      locationPermission?.delete) && (
                      <th className="px-4 py-3 text-right w-24">Action</th>
                    )}
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : countriesData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No countries found.
                      </td>
                    </tr>
                  ) : (
                    countriesData.map((country, index) => (
                      <tr
                        key={country._id}
                        className="hover:bg-(--primary)/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + (index + 1)}
                        </td>
                        <td
                          className="px-4 py-2.5 font-semibold text-sm cursor-pointer hover:text-(--primary)"
                          onClick={() =>
                            navigate(`/dashboard/location/${country._id}`)
                          }
                        >
                          {country.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() =>
                              handleToggle(country._id, country.status)
                            }
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              country.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                country.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        {(locationPermission?.edit ||
                          locationPermission?.delete) && (
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex justify-end gap-2">
                              {locationPermission?.edit && (
                                <div className="relative group">
                                  <button
                                    onClick={() => openEditModal(country)}
                                    className="p-1.5 cursor-pointer hover:text-(--primary) hover:bg-(--primary)/10 rounded-md transition-all"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-blue-400 text-[10px] px-2 py-2 rounded whitespace-nowrap pointer-events-none z-50">
                                    Edit country
                                    <span className="absolute top-full right-2 border-4 border-transparent border-t-black"></span>
                                  </span>
                                </div>
                              )}

                              {locationPermission?.delete && (
                                <div className="relative group">
                                  <button
                                    onClick={() => handleDelete(country._id)}
                                    className="p-1.5 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-30"
                                    disabled={deleteLoading}
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                  <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-red-400 text-[10px] px-2 py-2 rounded whitespace-nowrap pointer-events-none z-50">
                                    Delete country
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
                Showing {countriesData.length} entries
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className={`${theme.modal} p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">
                {editingCountry ? "Edit Country" : "New Country"}
              </h3>
              <button
                onClick={closeModal}
                className="opacity-50 cursor-pointer hover:text-(--primary)"
              >
                <FiXCircle size={16} />
              </button>
            </div>

            <Formik
              initialValues={{ countryName: editingCountry?.name || "" }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={submitCountryFunction}
            >
              {({ errors, touched }) => (
                <Form className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Country Name
                    </label>
                    <Field
                      name="countryName"
                      placeholder="Enter country name"
                      className={`w-full p-2 text-sm rounded-lg border outline-none focus:border-(--primary) transition-all ${theme.input} ${
                        errors.countryName && touched.countryName
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="countryName"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 block"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createLoading || updateLoading}
                    className="w-full cursor-pointer py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {editingCountry
                      ? updateLoading
                        ? "Updating..."
                        : "Update"
                      : createLoading
                        ? "Creating..."
                        : "Create"}
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

export default Location;
