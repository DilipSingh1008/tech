import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation: Reset link bhejne ka natak
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-bg)] p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)] rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="dark-glass rounded-2xl p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/80 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              // --- FORM STATE ---
              <div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-6 group"
                >
                  <ArrowLeft
                    size={14}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  BACK TO LOGIN
                </Link>

                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                    Reset Password
                  </h1>
                  <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">
                    Enter your admin email and we'll send you a secure link to
                    reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                      Registered Email
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

                  <button
                    disabled={loading}
                    className="w-full py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--main-bg)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[var(--primary-glow)]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // --- SUCCESS STATE ---
              <div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
                  <CheckCircle2 className="text-[var(--primary)]" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">
                  Check your email
                </h2>
                <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                  We have sent a password reset link to <br />
                  <span className="text-[var(--text-main)] font-semibold">
                    {email}
                  </span>
                </p>
                <Link
                  to="/login"
                  className="block w-full py-3 border border-[var(--border-color)] hover:bg-[var(--border-color)] text-[var(--text-main)] font-bold rounded-xl transition-all"
                >
                  Return to Login
                </Link>
                <p className="mt-6 text-xs text-[var(--text-muted)]">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[var(--primary)] hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
