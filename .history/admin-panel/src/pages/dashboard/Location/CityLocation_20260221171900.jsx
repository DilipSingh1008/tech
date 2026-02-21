import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
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
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem,
} from "../../../services/api";

const CityLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [citiesData, setCitiesData] = useState([]);
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
  const [editingCity, setEditingCity] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id, page, sortBy, order]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getItems(
        `statelocation/${id}/all-cities?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
      );
      setCitiesData(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
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
    setPage(1);
  };

  const validationSchema = Yup.object({
    cityName: Yup.string()
      .min(2, "Name too short!")
      .max(50, "Name too long!")
      .required("Required"),
  });

  const openAddModal = () => {
    setEditingCity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (city) => {
    setEditingCity(city);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCity(null);
  };

  const submitCityFunction = async (values, { resetForm }) => {
    try {
      if (editingCity) {
        setUpdateLoading(true);
        await updateItem(`citylocation/${editingCity._id}/edit-city`, {
          city: values.cityName,
        });
      } else {
        setCreateLoading(true);
        await createItem(`citylocation/${id}/`, {
          city: values.cityName,
        });
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

  const handleDelete = async (cityId) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`citylocation/${cityId}/delete-city`);
      if (editingCity?._id === cityId) closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (cityId, currentStatus) => {
    try {
      await patchItem(`citylocation/${cityId}/toggle-status`, {
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
            <h2 className="text-lg font-bold">Cities</h2>
            <button
              onClick={openAddModal}
              className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <FiPlusCircle size={14} /> Add City
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
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        City Name
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
                  ) : citiesData.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center opacity-40">No cities found.</td></tr>
                  ) : (
                    citiesData.map((city, index) => (
                      <tr key={city._id} className="hover:bg-(--primary)/5 transition-colors">
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + (index + 1)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-sm hover:text-(--primary) transition-colors cursor-pointer">
                          {city.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggle(city._id, city.status)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              city.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${city.status ? "translate-x-5" : "translate-x-1"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(city)}
                              className="p-1.5 text-(--primary) hover:bg-(--primary)/10 rounded-md transition-all"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(city._id)}
                              disabled={deleteLoading}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-30"
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

            {/* Pagination */}
            <div className={`flex items-center justify-between p-3 border-t ${theme.divider}`}>
              <span className="text-[11px] opacity-60">
                Showing {citiesData.length} entries
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
          <div className={`${theme.modal} p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">{editingCity ? "Edit City" : "New City"}</h3>
              <button onClick={closeModal} className="opacity-50 hover:text-(--primary) transition-colors">
                <FiXCircle size={16} />
              </button>
            </div>

            <Formik
              initialValues={{ cityName: editingCity ? editingCity.name : "" }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={submitCityFunction}
            >
              {({ errors, touched }) => (
                <Form className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">City Name</label>
                    <Field
                      name="cityName"
                      placeholder="e.g. Jodhpur"
                      className={`w-full p-2 text-sm rounded-lg border outline-none focus:border-(--primary) transition-all ${theme.input} ${errors.cityName && touched.cityName ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage name="cityName" component="span" className="text-red-400 text-[10px] mt-1 ml-1 block" />
                  </div>
                  <button
                    type="submit"
                    disabled={createLoading || updateLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
                  >
                    {editingCity ? (updateLoading ? "Updating..." : "Update") : (createLoading ? "Creating..." : "Create")}
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

export default CityLocation;