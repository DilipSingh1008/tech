import React, { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  MapPin,
  Briefcase,
  Code,
  Plus,
  Search,
  Loader2,
} from "lucide-react";

const CareerTable = ({ onEdit, onCreateNew }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCareers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/career");
      const data = await res.json();
      setCareers(data);
    } catch (err) {
      console.error("Error fetching careers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await fetch(`http://localhost:5000/api/career/${id}`, {
          method: "DELETE",
        });
        setCareers(careers.filter((job) => job._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const filteredCareers = careers.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500 font-medium">Syncing Job Board...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add New Opening
        </button>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Stack
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCareers.length > 0 ? (
                filteredCareers.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* Position Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            {job.title}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            ID: {job._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Details Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={14} className="text-red-400" />{" "}
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              job.type === "Full-Time"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Stack Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Code size={16} className="text-slate-400" />
                        <span className="truncate max-w-[150px]">
                          {job.stack}
                        </span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(job)}
                          className="p-2 hover:bg-white hover:text-blue-600 text-slate-400 rounded-lg border border-transparent hover:border-blue-100 hover:shadow-sm transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-2 hover:bg-white hover:text-red-600 text-slate-400 rounded-lg border border-transparent hover:border-red-100 hover:shadow-sm transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Briefcase size={48} />
                      <p className="mt-2 font-medium">No job postings found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareerTable;
