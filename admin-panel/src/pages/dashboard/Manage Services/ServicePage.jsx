import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Plus, Trash2, Edit3, ImageIcon } from "lucide-react";
import {
  getItems,
  // createItem,
  updateItem,
  deleteItem,
} from "../../../services/api";
import Searchbar from "../../../components/Searchbar";
import { useNavigate } from "react-router-dom";

// const generateSlug = (text) =>
//   text
//     ?.toLowerCase()
//     .replace(/ /g, "-")
//     .replace(/[^\w-]+/g, "");

const ManageServicesPage = () => {
  const { isDarkMode } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getItems("service");
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      await deleteItem(`service/${id}`);
      fetchServices();
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    await updateItem(`service/${id}`, { status: !currentStatus });
    fetchServices();
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs">
        Loading...
      </div>
    );

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4">
          {/* Top */}
          <div className="flex justify-between mb-4">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
            <button
              onClick={() => navigate("/dashboard/service/add")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold"
            >
              <Plus size={14} /> Add Service
            </button>
          </div>

          {/* Table */}
          <div
            className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}
          >
            <table className="w-full text-xs">
              <thead className={`uppercase font-bold ${theme.header}`}>
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Service Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {services
                  .filter((s) =>
                    s.name?.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((s, index) => (
                    <tr key={s._id} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden">
                          {s.featuredImage ? (
                            <img
                              src={`http://localhost:5000${s.featuredImage}`}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            <ImageIcon size={14} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 font-semibold">{s.name}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleToggleStatus(s._id, s.status)}
                          className={`w-8 h-4 rounded-full relative ${s.status ? "bg-(--primary)" : "bg-gray-400"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${s.status ? "left-4.5" : "left-0.5"}`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-2 text-right flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/services/edit/${s._id}`)
                          }
                        >
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(s._id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageServicesPage;
