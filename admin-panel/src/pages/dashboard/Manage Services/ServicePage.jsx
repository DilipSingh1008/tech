import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Plus, Trash2, Edit3, FileText } from "lucide-react";
import {
  getItems,
  // updateItem,
  deleteItem,
  patchItem,
} from "../../../services/api";
import Searchbar from "../../../components/Searchbar";
import { useNavigate } from "react-router-dom";

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
      const res = await getItems("services");
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      await deleteItem(`services/${id}`);
      fetchServices();
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await patchItem(`services/togal/${id}`, {});
      console.log("New status:", res);
      fetchServices(); // reload list
    } catch (err) {
      console.error("Error toggling status:", err);
    }
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
        <div className="max-w-5xl mx-auto">
          {/* Top */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />

            <button
              onClick={() => navigate("/dashboard/service/add")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold w-full sm:w-auto"
            >
              <Plus size={14} /> Add Service
            </button>
          </div>

          {/* Table */}
          <div
            className={`rounded-xl border shadow-sm overflow-x-auto ${theme.card}`}
          >
            <table className="min-w-[900px] w-full text-xs">
              <thead className={`uppercase font-bold ${theme.header}`}>
                <tr>
                  <th className="px-2 py-3 text-left whitespace-nowrap">ID</th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    Slug
                  </th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    SubCategory
                  </th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    Short Desc
                  </th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-2 py-3 text-right whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {services
                  .filter((s) =>
                    s.name?.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((s, index) => (
                    <tr
                      key={s._id}
                      className="border-t hover:bg-gray-100 dark:hover:bg-[#1a2030]"
                    >
                      <td className="px-2 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>

                      <td
                        className="px-2 py-2 whitespace-nowrap truncate max-w-[150px]"
                        title={s.name}
                      >
                        {s.name}
                      </td>

                      <td
                        className="px-2 py-2 whitespace-nowrap truncate max-w-[120px]"
                        title={s.slug}
                      >
                        {s.slug}
                      </td>

                      <td className="px-2 py-2 whitespace-nowrap">
                        {s.category?.name || "-"}
                      </td>

                      <td className="px-2 py-2 whitespace-nowrap">
                        {s.subCategory?.name || "-"}
                      </td>

                      <td
                        className="px-2 py-2 whitespace-nowrap truncate max-w-[180px]"
                        title={s.shortDescription}
                      >
                        {s.shortDescription}
                      </td>

                      {/* Status */}
                      <td className="px-2 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(s._id, s.status)}
                          className={`w-8 h-4 rounded-full relative ${
                            s.status ? "bg-(--primary)" : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                              s.status ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/service/edit/${s._id}`)
                            }
                            className="cursor-pointer p-1.5 hover:text-(--primary) transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(s._id)}
                            className="cursor-pointer p-1.5 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
