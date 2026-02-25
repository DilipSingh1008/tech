import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Link add kiya
import { Lock, Mail, Eye, EyeOff, Loader2, Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({ email, password });
      navigate("/dashboard");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-bg)] p-4 overflow-hidden relative">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)] rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="dark-glass rounded-2xl p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/80">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
              <Shield className="text-[var(--primary)]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Admin Portal
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Authorized access only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Managed */}
            <div className="flex justify-end pr-1">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--main-bg)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[var(--primary-glow)]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Minimal Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-bold">
              Secure Environment v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
