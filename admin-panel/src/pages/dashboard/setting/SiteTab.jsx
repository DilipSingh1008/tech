import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getItems, updateItem } from "../../../services/api";

const SiteSettingsForm = () => {
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
        // Based on your screenshot, the data is inside res.data.data
        const fetchedData = res.data.data; 

        if (fetchedData) {
          setInitialValues({
            site_name: fetchedData.site_name || "",
            site_address: fetchedData.site_address || "",
            logo: null, 
            favicon: null,
          });

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
      if (values.logo) formData.append("logo", values.logo);
      if (values.favicon) formData.append("favicon", values.favicon);

      await updateItem("setting/site", formData);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Removed max-w-4xl and extra background wrappers to prevent 'box-in-box' look */
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Site Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Site Name</label>
                <Field
                  name="site_name"
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <ErrorMessage name="site_name" component="div" className="text-red-500 text-xs" />
              </div>

              {/* Office Address */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Office Address</label>
                <Field
                  as="textarea"
                  name="site_address"
                  rows="3"
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
                <ErrorMessage name="site_address" component="div" className="text-red-500 text-xs" />
              </div>
            </div>

            {/* Logo & Favicon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { label: "Site Logo", name: "logo" },
                { label: "Favicon", name: "favicon" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</label>
                  
                  <div className="w-32 h-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#0f172a] flex items-center justify-center overflow-hidden">
                    {previews[item.name] ? (
                      <img src={previews[item.name]} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">No Image</span>
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
                      className="inline-block px-4 py-2 text-xs font-medium bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 rounded cursor-pointer hover:bg-blue-600/20 transition-all"
                    >
                      Change {item.label}
                    </label>
                  </div>
                  <ErrorMessage name={item.name} component="div" className="text-red-500 text-xs" />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isSubmitting ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SiteSettingsForm;