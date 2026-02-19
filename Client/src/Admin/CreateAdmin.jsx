import React, { useState } from "react";
import axios from "axios";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );
      setStatus({
        type: "success",
        message: res.data.message || "New admin created successfully!",
      });
      setFormData({ name: "", email: "", password: "" }); // Reset form
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message || "Failed to create admin account",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-100 p-3 rounded-2xl">
          <UserPlus className="text-emerald-600" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registration</h2>
          <p className="text-slate-500 text-sm">
            Add a new administrator to the system
          </p>
        </div>
      </div>

      {/* Notification Message */}
      {status.message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name Input */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Full Name
          </label>
          <div className="relative group">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              name="email"
              type="email"
              placeholder="admin@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 pt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <UserPlus size={20} />
            )}
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>

          <button
            type="button"
            onClick={() => setFormData({ name: "", email: "", password: "" })}
            className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl transition-all"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Informational Footer */}
      <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-xs text-blue-600 leading-relaxed">
          <strong>Note:</strong> New administrators will have full access to
          modify dashboard content. Please ensure the email address is correct
          as they will use it for logging in.
        </p>
      </div>
    </div>
  );
};

export default CreateAdmin;
