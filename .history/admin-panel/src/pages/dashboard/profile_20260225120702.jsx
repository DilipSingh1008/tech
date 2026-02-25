import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  User,
  Camera,
  Save,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getItems, updateItem } from "../../services/api.js";

// Defined OUTSIDE the component to prevent remount on every render
const inputClass = (touched, error) =>
  `w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-transparent outline-none transition-all ${
    touched && error
      ? "border-red-400 focus:border-red-400"
      : "border-gray-200 focus:border-[var(--primary)]"
  }`;

const PasswordInput = ({ field, placeholder, show, onToggle, form }) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      placeholder={placeholder}
      {...form.getFieldProps(field)}
      className={`${inputClass(form.touched[field], form.errors[field])} pr-10`}
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </div>
);

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [initialProfileValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    photo: null,
  });

  // Formik for Basic Information (declared before useEffect that calls profileForm.setValues)
  const profileForm = useFormik({
    initialValues: initialProfileValues,
    enableReinitialize: true,
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
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update profile");
      }
    },
  });

  // Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getItems("admin/profile");
        const raw = response?.data || response;
        const data = Array.isArray(raw) ? raw[0] : raw;

        profileForm.setValues({
          fullName: data?.fullName || "",
          email: data?.email || "",
          phone: data?.phone || "",
          photo: null,
        });

        if (data?.photo) setProfilePhotoPreview(data.photo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Formik for Password Change
  const passwordForm = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your new password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateItem("admin/change-password", {
          newPassword: values.newPassword,
        });
        setPasswordSuccess(true);
        setTimeout(() => setPasswordSuccess(false), 3000);
        resetForm();
      } catch (err) {
        alert(err.response?.data?.message || "Error changing password");
      }
    },
  });

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
                  <User size={16} className="text-[var(--primary)]" />
                  Basic Information
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
                            <img
                              src={profilePhotoPreview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={40} strokeWidth={1.5} />
                          )}
                        </div>
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform">
                        <Camera size={14} className="text-gray-600" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      Admin Photo
                    </span>
                  </div>

                  {/* Input Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...profileForm.getFieldProps("fullName")}
                        className={inputClass(
                          profileForm.touched.fullName,
                          profileForm.errors.fullName
                        )}
                      />
                      {profileForm.touched.fullName && profileForm.errors.fullName && (
                        <p className="text-[10px] text-red-500 ml-1">
                          {profileForm.errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value="Admin"
                        readOnly
                        className="w-full px-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-white/5 border-gray-100 cursor-not-allowed text-gray-400 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...profileForm.getFieldProps("email")}
                        className={inputClass(
                          profileForm.touched.email,
                          profileForm.errors.email
                        )}
                      />
                      {profileForm.touched.email && profileForm.errors.email && (
                        <p className="text-[10px] text-red-500 ml-1">
                          {profileForm.errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        {...profileForm.getFieldProps("phone")}
                        className={inputClass(
                          profileForm.touched.phone,
                          profileForm.errors.phone
                        )}
                      />
                      {profileForm.touched.phone && profileForm.errors.phone && (
                        <p className="text-[10px] text-red-500 ml-1">
                          {profileForm.errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end items-center gap-3">
                  {profileSuccess && (
                    <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <CheckCircle2 size={14} /> Saved successfully
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={profileForm.isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {profileForm.isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {profileForm.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* --- SECURITY SECTION FORM --- */}
            <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 dark:bg-white/5">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-500" />
                  Security & Privacy
                </h2>
              </div>

              <form onSubmit={passwordForm.handleSubmit} className="p-6 md:p-8 space-y-6">
                <p className="text-xs text-gray-400">
                  Set a new password for your account. Must be at least 6 characters.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      New Password
                    </label>
                    <PasswordInput
                      field="newPassword"
                      placeholder="••••••••"
                      show={showNew}
                      onToggle={() => setShowNew((v) => !v)}
                      form={passwordForm}
                    />
                    {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                      <p className="text-[10px] text-red-500">
                        {passwordForm.errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Confirm New
                    </label>
                    <PasswordInput
                      field="confirmPassword"
                      placeholder="••••••••"
                      show={showConfirm}
                      onToggle={() => setShowConfirm((v) => !v)}
                      form={passwordForm}
                    />
                    {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                      <p className="text-[10px] text-red-500">
                        {passwordForm.errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <p className="text-[10px] text-gray-400 italic">
                    Use a strong password with at least 6 characters
                  </p>
                  <div className="flex items-center gap-3">
                    {passwordSuccess && (
                      <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <CheckCircle2 size={14} /> Password updated
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={passwordForm.isSubmitting}
                      className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {passwordForm.isSubmitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ShieldCheck size={14} />
                      )}
                      {passwordForm.isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
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