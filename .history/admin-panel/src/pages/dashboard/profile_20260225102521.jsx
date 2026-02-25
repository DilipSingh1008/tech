import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Camera, Save, ShieldCheck, ChevronRight } from "lucide-react";
import { getItems, updateItem } from "../../services/api.js"; // Assuming these are your axios wrappers

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // --- 1. Basic Info Form Logic ---
  const profileForm = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      photo: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().min(10, "Too short").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        if (values.photo) formData.append("photo", values.photo);

        // API Call to updateProfile
        await updateItem("admin/rofile", formData); 
        alert("Profile updated successfully!");
      } catch (err) {
        console.error(err);
      }
    },
  });

  // --- 2. Password Form Logic ---
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Required"),
      newPassword: Yup.string().min(6, "Min 6 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateItem("admin/change-password", values);
        alert("Password changed!");
        resetForm();
      } catch (err) {
        alert("Error changing password");
      }
    },
  });

  // --- 3. Fetch Initial Data ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getItems("admin/profile"); // Assuming getItems handles the GET request
        profileForm.setValues({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      profileForm.setFieldValue("photo", file);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="flex h-screen bg-[var(--main-bg)] text-[var(--text-main)] font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[var(--main-bg)]">
          <div className="mx-auto p-1 md:p-10 space-y-10">
            
            {/* BASIC INFO SECTION */}
            <form onSubmit={profileForm.handleSubmit} className="bg-white dark:bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 dark:bg-white/5">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <User size={16} className="text-[var(--primary)]" /> Basic Information
                </h2>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Photo Upload */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-2 border-gray-100 p-1">
                        <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                          {profilePhoto ? (
                            <img src={profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            <User size={40} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-white border rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform">
                        <Camera size={14} className="text-gray-600" />
                        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase ml-1">Full Name</label>
                      <input
                        name="fullName"
                        className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${profileForm.errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                        {...profileForm.getFieldProps("fullName")}
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase ml-1">Email</label>
                      <input
                        name="email"
                        type="email"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                        {...profileForm.getFieldProps("email")}
                      />
                    </div>
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 uppercase ml-1">Phone</label>
                      <input
                        name="phone"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                        {...profileForm.getFieldProps("phone")}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            </form>

            {/* SECURITY SECTION */}
            <form onSubmit={passwordForm.handleSubmit} className="bg-white dark:bg-[var(--card-bg)] rounded-xl border-gray-100 shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-semibold">Security & Privacy</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                      {...passwordForm.getFieldProps("currentPassword")}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                      {...passwordForm.getFieldProps("newPassword")}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Confirm New</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                      {...passwordForm.getFieldProps("confirmPassword")}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <button type="submit" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
                    Update Password <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </form>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;