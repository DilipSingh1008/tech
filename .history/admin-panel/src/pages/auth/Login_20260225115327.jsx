import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Save, Mail, Edit3, Loader2, Shield, AlertCircle, ArrowLeft } from "lucide-react";
import { createItem, updateItem } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you have an ID in the URL
  const { state } = useLocation(); // Optional: if you passed the current item data via Link state

  // 1. Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // 2. Formik Logic
  const formik = useFormik({
    initialValues: {
      // Use existing values from state if available, otherwise empty
      email: state?.email || "",
      password: state?.password || "",
    },
    enableReinitialize: true, // Important: allows form to update if state/API data loads late
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Calling your imported API service
     const response =   await createItem("admin/login", values); 

     console.log(response.data);
     

     localStorage.setItem("adminToken", response.data.token);
        
        // Success feedback
        navigate("/dashboard", { state: { message: "Item updated successfully!" } });
      } catch (error) {
        setStatus(error.response?.data?.message || "Failed to update item. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-bg)] p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)] rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-[400px] z-10">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="dark-glass rounded-2xl p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/80">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
              <Edit3 className="text-[var(--primary)]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Update Record</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Modifying entry ID: {id}</p>
          </div>

          {formik.status && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle size={16} /> {formik.status}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                Update Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-[var(--text-muted)]'}`} size={18} />
                <input
                  name="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className={`w-full pl-10 pr-4 py-3 bg-[var(--sidebar-bg)] border rounded-xl text-[var(--text-main)] outline-none transition-all duration-200 
                    ${formik.touched.email && formik.errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--primary)]'}`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-[10px] text-red-400 ml-1 mt-1 uppercase font-bold tracking-tight">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1">
                New Password
              </label>
              <div className="relative">
                <Edit3 className={`absolute left-3 top-1/2 -translate-y-1/2 ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-[var(--text-muted)]'}`} size={18} />
                <input
                  name="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  className={`w-full pl-10 pr-4 py-3 bg-[var(--sidebar-bg)] border rounded-xl text-[var(--text-main)] outline-none transition-all duration-200 
                    ${formik.touched.password && formik.errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--primary)]'}`}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-[10px] text-red-400 ml-1 mt-1 uppercase font-bold tracking-tight">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.dirty}
              className="w-full py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--main-bg)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-lg"
            >
              {formik.isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} /> Update Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;