import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  User,
  Camera,
  Save,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  Loader2
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getItems, updateItem } from "../../services/api.js";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 1. Initial State for Basic Info
  const [initialProfileValues, setInitialProfileValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    photo: null,
  });

  // 2. Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getItems("admin/profile");
        // Adjust based on your API response structure (e.g., response.data or response)
        const data = response?.data || response;

        setInitialProfileValues({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          photo: null, // Reset file input
        });

        if (data.photo) {
          setProfilePhotoPreview(data.photo);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 3. Formik for Basic Information
  const profileForm = useFormik({
    initialValues: initialProfileValues,
    enableReinitialize: true, // This makes the values visible once API data loads
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        if (values.photo) {
          formData.append("photo", values.photo);
        }

        await updateItem("admin/profile", formData);
        alert("Profile updated successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update profile");
      }
    },
  });

  // 4. Formik for Password Change
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateItem("admin/change-password", values);
        alert("Password changed successfully!");
        resetForm();
      } catch (err) {
        alert(err.response?.data?.message || "Error changing password");
      }
    },
  });

  // Handle Photo Selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      profileForm.setFieldValue("photo", file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--main-bg)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--main-bg)] text-[var(--text-main)] font-sans antialiased">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[var(--main-bg)]">
          <div className="mx-auto p-1 md:p-10 space-y-10">
            
            {/* --- BASIC INFORMATION FORM --- */}
            <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden">
              <div className="p-1 px-6 py-4 border-b border-gray-50 bg-gray-50/50 dark:bg-white/5">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <User size={16} className="text-[var(--primary)]" /> Basic Information
                </h2>
              </div>

              <form onSubmit={profileForm.handleSubmit} className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Photo Section */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-2 border-gray-100 p-1">
                        <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                          {profilePhotoPreview ? (
                            <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User size={40} strokeWidth={1.5} />
                          )}
                        </div>
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform">
                        <Camera size={14} className="text-gray-600" />
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                      </label>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Admin Photo</span>
                  </div>

                  {/* Input Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                      <input
                        type="text"
                        {...profileForm.getFieldProps("fullName")}
                        className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-transparent outline-none transition-all ${
                          profileForm.touched.fullName && profileForm.errors.fullName ? "border-red-500" : "border-gray-200 focus:border-[var(--primary)]"
                        }`}
                      />
                      {profileForm.touched.fullName && profileForm.errors.fullName && (
                        <p className="text-[10px] text-red-500 ml-1">{profileForm.errors.fullName}</p>
                      )}
                    </div>

                    {/* Role (Read Only) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">Role</label>
                      <input
                        type="text"
                        value="Admin"
                        readOnly
                        className="w-full px-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-white/5 border-gray-100 cursor-not-allowed text-gray-400 outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">Email</label>
                      <input
                        type="email"
                        {...profileForm.getFieldProps("email")}
                        className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-transparent outline-none transition-all ${
                            profileForm.touched.email && profileForm.errors.email ? "border-red-500" : "border-gray-200 focus:border-[var(--primary)]"
                        }`}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">Phone</label>
                      <input
                        type="text"
                        {...profileForm.getFieldProps("phone")}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[var(--primary)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileForm.isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} /> {profileForm.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* --- SECURITY SECTION FORM --- */}
            <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl border-gray-100 shadow-sm">
              <form onSubmit={passwordForm.handleSubmit} className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-semibold">Security & Privacy</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...passwordForm.getFieldProps("currentPassword")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-transparent focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...passwordForm.getFieldProps("newPassword")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-transparent focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Confirm New</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...passwordForm.getFieldProps("confirmPassword")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-transparent focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <button type="submit" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
                    Update Security Settings <ChevronRight size={14} />
                  </button>
                  <p className="text-[10px] text-gray-400 italic">Manage your account protection</p>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;