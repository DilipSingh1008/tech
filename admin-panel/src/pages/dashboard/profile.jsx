import { useState } from "react";
import {
  User,
  Camera,
  Save,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const ProfilePage = () => {
  const [fullName, setFullName] = useState("Akash Sharma");
  const [email, setEmail] = useState("akash@example.com");
  const [phone, setPhone] = useState("123-456-7890");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[var(--main-bg)] text-[var(--text-main)] font-sans antialiased">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[var(--main-bg)]">
          <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10">
            {/* Minimal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your personal information and security.
                </p>
              </div>
              {/* <button
                onClick={() => alert("Logged out")}
                className="text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign Out
              </button> */}
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl border   shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="p-1 px-6 py-4 border-b border-gray-50  bg-gray-50/50 dark:bg-white/5">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <User size={16} className="text-[var(--primary)]" /> Basic
                  Information
                </h2>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Slim Avatar Upload */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-2 border-gray-100  p-1">
                        <div className="w-full h-full rounded-full bg-gray-100  flex items-center justify-center text-gray-400">
                          <User size={40} strokeWidth={1.5} />
                        </div>
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-white  border border-gray-200  rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform">
                        <Camera
                          size={14}
                          className="text-gray-600 dark:text-gray-300"
                        />
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      Admin Photo
                    </span>
                  </div>

                  {/* Form - Slim Inputs */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {[
                      {
                        label: "Full Name",
                        value: fullName,
                        setter: setFullName,
                        icon: null,
                      },
                      {
                        label: "Role",
                        value: "Admin",
                        setter: null,
                        readOnly: true,
                      },
                      {
                        label: "Email",
                        value: email,
                        setter: setEmail,
                        type: "email",
                      },
                      { label: "Phone", value: phone, setter: setPhone },
                    ].map((field, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
                          {field.label}
                        </label>
                        <input
                          type={field.type || "text"}
                          value={field.value}
                          onChange={(e) =>
                            field.setter && field.setter(e.target.value)
                          }
                          readOnly={field.readOnly}
                          className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-transparent outline-none transition-all ${
                            field.readOnly
                              ? "bg-gray-50 dark:bg-white/5 border-gray-100  cursor-not-allowed text-gray-400"
                              : "border-gray-200  focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    // onClick={handleProfileUpdate}
                    className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Security Section - More Compact */}
            <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl border border-gray-100  shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-semibold">Security & Privacy</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      label: "Current Password",
                      val: currentPassword,
                      set: setCurrentPassword,
                    },
                    {
                      label: "New Password",
                      val: newPassword,
                      set: setNewPassword,
                    },
                    {
                      label: "Confirm New",
                      val: confirmPassword,
                      set: setConfirmPassword,
                    },
                  ].map((pw, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        {pw.label}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-transparent focus:border-[var(--primary)] outline-none"
                        value={pw.val}
                        onChange={(e) => pw.set(e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-50  flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <button className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
                    Update Security Settings <ChevronRight size={14} />
                  </button>
                  <p className="text-[10px] text-gray-400 italic">
                    Last changed: 12 days ago from Jodhpur, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
