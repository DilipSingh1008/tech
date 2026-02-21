import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPlusCircle,
  FiXCircle,
} from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getItems(`statelocation/${id}`);
      setStatesData(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    stateName: Yup.string()
      .min(2, "Name too short!")
      .max(50, "Name too long!")
      .required("Required"),
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
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`statelocation/${stateId}/delete-state`);
      if (editingState?._id === stateId) closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
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
            <h2 className="text-lg font-bold">States</h2>
            <button
              onClick={openAddModal}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:bg-(--primary) transition-all"
            >
              <FiPlusCircle size={14} /> Add State
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
                    <th className="px-4 py-3">State Name</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.divider}`}>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-10 text-center opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    statesData.map((state, index) => (
                      <tr
                        key={state._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {index + 1}
                        </td>
                        <td
                          className="px-4 py-2.5 font-semibold text-sm cursor-pointer hover:text-blue-400 transition-colors"
                          onClick={() =>
                            navigate(`/dashboard/citylocation/${state._id}`)
                          }
                        >
                          {state.name}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openEditModal(state)}
                              className="p-1.5 hover:text-yellow-400 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(state._id)}
                              disabled={deleteLoading}
                              className="p-1.5 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete"
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
            {!isLoading && statesData.length === 0 && (
              <div className="p-10 text-center opacity-40 italic text-xs">
                No states found.
              </div>
            )}
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
                {editingState ? "Edit State" : "New State"}
              </h3>
              <button
                onClick={closeModal}
                className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <FiXCircle size={16} />
              </button>
            </div>

            <Formik
              initialValues={{
                stateName: editingState ? editingState.name : "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={submitStateFunction}
            >
              {({ errors, touched }) => (
                <Form className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                      State Name
                    </label>
                    <Field
                      name="stateName"
                      placeholder="e.g. Rajasthan"
                      className={`w-full p-2 text-sm rounded-lg border outline-none focus:border-blue-500 transition-all ${theme.input} ${
                        errors.stateName && touched.stateName
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="stateName"
                      component="span"
                      className="text-red-400 text-[10px] mt-1 ml-1 block"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={createLoading || updateLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {editingState ? (
                        <FiEdit2 size={12} />
                      ) : (
                        <FiPlusCircle size={12} />
                      )}
                      {editingState
                        ? updateLoading
                          ? "Updating..."
                          : "Update State"
                        : createLoading
                          ? "Creating..."
                          : "Create State"}
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

export default StateLocation;
