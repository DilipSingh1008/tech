import React, { useState } from "react";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  Code,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// 'onSuccess' prop humne CareerManager se liya hai
const CareerForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "Full-Time",
    stack: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/career",
        formData,
      );
      console.log(res);
      // Success Message dikhao
      setStatus({
        type: "success",
        message: "Job opportunity posted successfully!",
      });

      // 1.5 second baad wapas list par bhej do (onSuccess call karke)
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="text-blue-600" size={28} />
          Post a New Career Opening
        </h2>
        <p className="text-slate-500 mt-1">
          Fill in the details to list a new job on the careers page.
        </p>
      </div>

      {/* Status Alert */}
      {status.message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-bounce ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium text-sm">{status.message}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            required
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Remote / City Name"
            required
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Employment Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Tech Stack</label>
          <input
            type="text"
            name="stack"
            value={formData.stack}
            onChange={handleChange}
            placeholder="React, Node.js, etc."
            required
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-max px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={18} />
            )}
            {loading ? "Publishing..." : "Create Job Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareerForm;
