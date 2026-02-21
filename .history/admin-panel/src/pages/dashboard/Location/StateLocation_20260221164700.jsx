import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiPlusCircle,
  FiXCircle,
} from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem
} from "../../../services/api";

const StateLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [statesData, setStatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ⭐ pagination + sorting
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id, page, sortBy, order]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getItems(
        `statelocation/${id}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
      );

      setStatesData(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    stateName: Yup.string().min(2).max(50).required("Required"),
  });

  const openAddModal = () => {
    setEditingState(null);
    setIsModalOpen(true);
  };

  const openEditModal = (state) => {
    setEditingState(state);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingState(null);
  };

  const submitStateFunction = async (values, { resetForm }) => {
    try {
      if (editingState) {
        setUpdateLoading(true);
        await updateItem(`statelocation/${editingState._id}/edit-state`, {
          state: values.stateName,
        });
      } else {
        setCreateLoading(true);
        await createItem(`statelocation/${id}`, { state: values.stateName });
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

  const handleDelete = async (stateId) => {
    if (!window.confirm("Delete?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`statelocation/${stateId}/delete-state`);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ⭐ toggle status API
  const handleToggle = async (stateId, currentStatus) => {
    try {
      await patchItem(`statelocation/${stateId}/toggle-status`, {
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

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">States</h2>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              <FiPlusCircle size={14} /> Add State
            </button>
          </div>

          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead className={`uppercase tracking-wider font-bold ${theme.header}`}>
                <tr>
                  <th className="px-4 py-3 w-28">ID</th>

                  {/* ⭐ sorting */}
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => {
                      setSortBy("name");
                      setOrder(order === "asc" ? "desc" : "asc");
                    }}
                  >
                    State Name {order === "asc" ? "↑" : "↓"}
                  </th>

                  <th className="px-4 py-3 w-24">Status</th>
                  <th className="px-4 py-3 text-right w-24">Action</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${theme.divider}`}>
                {statesData.map((state, index) => (
                  <tr key={state._id}>
                    <td className="px-4 py-2.5 opacity-50 text-[10px]">{index + 1}</td>

                    <td
                      className="px-4 py-2.5 font-semibold text-sm cursor-pointer"
                      onClick={() => navigate(`/dashboard/citylocation/${state._id}`)}
                    >
                      {state.name}
                    </td>

                    {/* ⭐ toggle fix */}
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => handleToggle(state._id, state.status)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                          state.status ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white ${
                            state.status ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => openEditModal(state)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(state._id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ⭐ pagination */}
            <div className="flex justify-center gap-2 p-3">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span>Page {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </div>
      </main>

      {/* modal same as your code */}
    </div>
  );
};

export default StateLocation;