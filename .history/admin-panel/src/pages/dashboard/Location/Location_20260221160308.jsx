import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlusCircle, FiXCircle } from "react-icons/fi";
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

  // ⭐ pagination + sorting states
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
        `countrylocation?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
      );

      setCountriesData(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    countryName: Yup.string().min(2).max(50).required("Required"),
  });

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`countrylocation/${id}/delete-country`);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
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
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Location</h2>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <FiPlusCircle size={14} /> Add Country
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
                    <th className="px-4 py-3 w-28">ID</th>

                    {/* ⭐ Sorting header */}
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => {
                        setSortBy("name");
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                    >
                      Country Name {order === "asc" ? "↑" : "↓"}
                    </th>

                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
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
                  ) : (
                    countriesData.map((country, index) => (
                      <tr key={country._id} className="hover:bg-indigo-500/5">
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {index + 1}
                        </td>

                        <td
                          className="px-4 py-2.5 font-semibold text-sm cursor-pointer"
                          onClick={() =>
                            navigate(`/dashboard/location/${country._id}`)
                          }
                        >
                          {country.name}
                        </td>

                        {/* ⭐ toggle fix */}
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() =>
                              handleToggle(country._id, country.status)
                            }
                            className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                              country.status ? "bg-blue-600" : "bg-gray-400"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white ${
                                country.status
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => openEditModal(country)}>
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(country._id)}
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

            {/* ⭐ Pagination */}
            <div className="flex justify-center gap-2 p-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>

              <span className="px-2 text-sm">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal same as before (no change) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className={`${theme.modal} p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">
                {editingCountry ? "Edit Country" : "New Country"}
              </h3>

              <button
                onClick={closeModal}
                className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <FiXCircle size={16} />
              </button>
            </div>

            {/* ⭐ Formik Form */}
            <Formik
              initialValues={{
                countryName: editingCountry ? editingCountry.name : "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={submitCountryFunction}
            >
              {({ errors, touched }) => (
                <Form className="space-y-3">
                  {/* Country input */}
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      Country Name
                    </label>

                    <Field
                      name="countryName"
                      placeholder="e.g. India"
                      className={`w-full p-2 text-sm rounded-lg border outline-none focus:border-blue-500 transition-all ${theme.input} ${
                        errors.countryName && touched.countryName
                          ? "border-red-500"
                          : ""
                      }`}
                    />

                    <ErrorMessage
                      name="countryName"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 ml-1 block"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={createLoading || updateLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {editingCountry ? (
                        <FiEdit2 size={12} />
                      ) : (
                        <FiPlusCircle size={12} />
                      )}

                      {editingCountry
                        ? updateLoading
                          ? "Updating..."
                          : "Update Country"
                        : createLoading
                          ? "Creating..."
                          : "Create Country"}
                    </button>
                  </div>
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
