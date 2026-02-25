import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, Mail, Eye, EyeOff, Loader2, Shield, AlertCircle } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Validation Schema using Yup
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
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Replace this with your actual API endpoint
        // await axios.post('/api/login', values); 
        
        await login(values); // API Call through Context
        navigate("/dashboard");
      } catch (error) {
        setStatus("Invalid credentials. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-bg)] p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)] rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-[400px] z-10">
        <div className="dark-glass rounded-2xl p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/80">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
              <Shield className="text-[var(--primary)]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Admin Portal</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Authorized access only</p>
          </div>

          {/* API Error Message */}
          {formik.status && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle size={16} /> {formik.status}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-[var(--text-muted)]'}`} size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@system.com"
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
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-[var(--text-muted)]'}`} size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...formik.getFieldProps("password")}
                  className={`w-full pl-10 pr-12 py-3 bg-[var(--sidebar-bg)] border rounded-xl text-[var(--text-main)] outline-none transition-all duration-200 
                    ${formik.touched.password && formik.errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--primary)]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-[10px] text-red-400 ml-1 mt-1 uppercase font-bold tracking-tight">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex justify-end pr-1">
              <Link to="/forgot-password" size={18} className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--main-bg)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[var(--primary-glow)]"
            >
              {formik.isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Login"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-bold">Secure Environment v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;