import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "../../../context/ThemeContext";
import { getItems, updateItem } from "../../../services/api";


const SiteSettingsForm = () => {
  const { isDarkMode } = useTheme();
  const [initialValues, setInitialValues] = useState({
    site_name: "",
    site_address: "",
    logo: null,
    favicon: null,
  });

  const [previews, setPreviews] = useState({ logo: null, favicon: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getItems("setting/site");
        const fetchedData = res.data;

        console.log("rgregr",fetchedData);
        

        if (fetchedData) {
          setInitialValues({
            site_name: fetchedData.site_name || "",
            site_address: fetchedData.site_address || "",
            logo: null,
            favicon: null,
          });

          // Fallback to localhost if path exists
          setPreviews({
            logo: fetchedData.logo ? `http://localhost:5000${fetchedData.logo}` : null,
            favicon: fetchedData.favicon ? `http://localhost:5000${fetchedData.favicon}` : null,
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    site_name: Yup.string().min(3, "Too Short!").required("Required"),
    site_address: Yup.string().min(10, "Address too short").required("Required"),
  });

  // Dynamic Theme Object consistent with your Location page
  const theme = {
    input: isDarkMode
      ? "bg-gray-500/5 border-gray-500/20 text-white focus:border-(--primary)"
      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-(--primary)",
    label: isDarkMode ? "text-gray-400" : "text-gray-500",
    imageBox: isDarkMode ? "bg-[#0b0e14] border-gray-800" : "bg-gray-100 border-gray-200",
    buttonSecondary: isDarkMode 
      ? "bg-(--primary)/10 text-(--primary) border-(--primary)/20 hover:bg-(--primary)/20" 
      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300",
  };

  const handleFileChange = (event, setFieldValue, fieldName) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue(fieldName, file);
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("site_name", values.site_name);
      formData.append("site_address", values.site_address);
      if (values.logo) {
        formData.append("logo", values.logo);
      }
      if (values.favicon){
        formData.append("logo", values.favicon);
      }
        formData.append("folder", "settings");

      await updateItem("setting/site", formData);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Site Name */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Site Name
                </label>
                <Field
                  name="site_name"
                  placeholder="Enter site name"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                    theme.input
                  } ${errors.site_name && touched.site_name ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="site_name" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* Office Address */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Office Address
                </label>
                <Field
                  as="textarea"
                  name="site_address"
                  rows="1"
                  placeholder="Enter office address"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all resize-none ${
                    theme.input
                  } ${errors.site_address && touched.site_address ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="site_address" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>
            </div>

            {/* Logo & Favicon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[
                { label: "Site Logo", name: "logo" },
                { label: "Favicon", name: "favicon" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-4">
                  <label className={`block text-[10px] font-bold uppercase tracking-wider ${theme.label}`}>
                    {item.label}
                  </label>
                  
                  <div className={`w-40 h-40 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${theme.imageBox}`}>
                    {previews[item.name] ? (
                      <img src={previews[item.name]} alt="Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                      <span className="text-[10px] opacity-40 italic">No Image Uploaded</span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue, item.name)}
                      className="hidden"
                      id={`file-${item.name}`}
                    />
                    <label
                      htmlFor={`file-${item.name}`}
                      className={`inline-block px-4 py-2 text-[11px] font-bold uppercase tracking-tight rounded-md border cursor-pointer transition-all shadow-sm active:scale-95 ${theme.buttonSecondary}`}
                    >
                      Change {item.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-800/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-(--primary) hover:opacity-90 text-white px-8 py-2.5 cursor-pointer rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SiteSettingsForm;