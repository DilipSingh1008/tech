import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlusCircle, FiXCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem,
} from "../../../services/api";

const Location = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [countriesData, setCountriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination + Sorting states
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, sortBy, order]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getItems(
        `countrylocation?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
      );

      setCountriesData(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
      
      // If current page is greater than total pages (after deletion), go back
      if (res.pagination?.totalPages > 0 && page > res.pagination.totalPages) {
        setPage(res.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
    setPage(1); // Reset to first page when sorting changes
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`countrylocation/${id}/delete-country`);
      
      // If deleting the last item on the page, the useEffect/fetchData logic 
      // above will handle the page shift.
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ... (validationSchema, open/close modals, handleToggle, and theme object remain the same)
  const validationSchema = Yup.object({
    countryName: Yup.string().min(2).max(50).required("Required"),
  });

  const openAddModal = () => { setEditingCountry(null); setIsModalOpen(true); };
  const openEditModal = (country) => { setEditingCountry(country); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingCountry(null); };

  const submitCountryFunction = async (values, { resetForm }) => {
    try {
      if (editingCountry) {
        setUpdateLoading(true);
        await updateItem(`countrylocation/${editingCountry._id}/edit-country`, {
          country: values.countryName,
        });
      } else {
        setCreateLoading(true);
        await createItem("countrylocation", { country: values.countryName });
      }
      resetForm();
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
      setUpdateLoading(false);
    }
  };

  const handleToggle = async (countryId, currentStatus) => {
    try {
      await patchItem(`countrylocation/${countryId}/toggle-status`, {
        isActive: !currentStatus,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode ? "bg-[#151b28] border-gray-800" : "bg-white border-gray-200",
    header: isDarkMode ? "bg-[#1f2637] text-gray-400" : "bg-gray-100 text-gray-500",
    input: isDarkMode ? "bg-gray-500/5 border-gray-500/20 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
    modal: isDarkMode ? "bg-[#151b28] text-white" : "bg-white text-gray-800",
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
  };

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Location</h2>
            <button
              onClick={openAddModal}
              className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <FiPlusCircle size={14} /> Add Country
            </button>
          </div>

          {/* Table */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`uppercase tracking-wider font-bold ${theme.header}`}>
                  <tr>
                    <th className="px-4 py-3 w-16">#</th>
                    <th
  className="px-4 py-3 cursor-pointer hover:text-blue-500 transition-colors"
  onClick={() => handleSort("name")}
>
  <div className="flex items-center gap-1">
    Country Name 
    <span className="opacity-50 text-[10px]">
      {sortBy === "name" ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  </div>
</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center opacity-40 italic">Loading...</td></tr>
                  ) : countriesData.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center opacity-40">No countries found.</td></tr>
                  ) : (
                    countriesData.map((country, index) => (
                      <tr key={country._id} className="hover:bg-blue-500/5 transition-colors">
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + (index + 1)}
                        </td>
                        <td
                          className="px-4 py-2.5 font-semibold text-sm cursor-pointer"
                          onClick={() => navigate(`/dashboard/location/${country._id}`)}
                        >
                          {country.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggle(country._id, country.status)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              country.status ? "bg-blue-600" : "bg-gray-400"
                            }`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${country.status ? "translate-x-5" : "translate-x-1"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(country)} className="hover:text-blue-500 transition-colors">
                              <FiEdit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(country._id)} 
                              className="hover:text-red-500 transition-colors disabled:opacity-30"
                              disabled={deleteLoading}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className={`flex items-center justify-between p-3 border-t ${theme.divider}`}>
              <span className="text-[11px] opacity-60">
                Showing {countriesData.length} of {totalPages * limit} entries
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:bg-gray-500/10 transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>

                {/* Optional: Generate page numbers */}
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-7 h-7 text-[11px] rounded-md border transition-all ${
                            page === i + 1 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "hover:bg-gray-500/10 border-transparent"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                  disabled={page === totalPages || isLoading}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:bg-gray-500/10 transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal remains largely the same but ensure Formik values use the correct field "name" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className={`${theme.modal} p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">{editingCountry ? "Edit Country" : "New Country"}</h3>
              <button onClick={closeModal} className="opacity-50 hover:opacity-100 transition-opacity"><FiXCircle size={16} /></button>
            </div>

            <Formik
              initialValues={{ countryName: editingCountry ? editingCountry.name : "" }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={submitCountryFunction}
            >
              {({ errors, touched }) => (
                <Form className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">Country Name</label>
                    <Field
                      name="countryName"
                      placeholder="e.g. India"
                      className={`w-full p-2 text-sm rounded-lg border outline-none focus:border-blue-500 transition-all ${theme.input} ${errors.countryName && touched.countryName ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage name="countryName" component="span" className="text-red-400 text-[10px] mt-1 ml-1 block" />
                  </div>
                  <button
                    type="submit"
                    disabled={createLoading || updateLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {editingCountry ? (updateLoading ? "Updating..." : "Update Country") : (createLoading ? "Creating..." : "Create Country")}
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