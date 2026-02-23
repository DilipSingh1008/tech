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

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/setting/site");
      const data = res.data.data;

      setInitialValues({
        site_name: data?.site_name || "",
        site_address: data?.site_address || "",
        logo: null,
        favicon: null,
      });

      setPreviews({
        logo: data?.logo ? `http://localhost:5000${data.logo}` : null,
        favicon: data?.favicon ? `http://localhost:5000${data.favicon}` : null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);
  // Validation Schema
  const validationSchema = Yup.object().shape({
    site_name: Yup.string().min(3, "Too Short!").required("Required"),
    site_address: Yup.string().min(10, "Please provide a full address").required("Required"),
    logo: Yup.mixed().required("Logo is required"),
    favicon: Yup.mixed().required("Favicon is required"),
  });

//   const initialValues = {
//     site_name: "",
//     site_address: "",
//     logo: null,
//     favicon: null,
//   };

  // State for Image Previews
  const [previews, setPreviews] = useState({ logo: null, favicon: null });
  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getItems("setting/site");
      const data = res.data.data;

      setInitialValues({
        site_name: data?.site_name || "",
        site_address: data?.site_address || "",
        logo: null,
        favicon: null,
      });

      setPreviews({
        logo: data?.logo ? `http://localhost:5000${data.logo}` : null,
        favicon: data?.favicon ? `http://localhost:5000${data.favicon}` : null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);

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

    await updateItem(
       "setting/site",
       formData,
    );

    alert("Settings updated");
  } catch (error) {
    console.log(error);
  } finally {
    setSubmitting(false);
  }
};

return (
    <div className="max-w-4xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Site Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Site Name</label>
              <Field
                name="site_name"
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <ErrorMessage name="site_name" component="div" className="text-red-500 text-xs" />
            </div>

            {/* Office Address (Textarea) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Office Address</label>
              <Field
                as="textarea"
                name="site_address"
                rows="3"
                placeholder="123 Business St, Suite 100..."
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <ErrorMessage name="site_address" component="div" className="text-red-500 text-xs" />
            </div>

            {/* Logo & Favicon with Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Site Logo", name: "logo" },
                { label: "Favicon", name: "favicon" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</label>
                  
                  {/* Preview Box */}
                  <div className="w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {previews[item.name] ? (
                      <img src={previews[item.name]} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-400">No Image</span>
                    )}
                  </div>

                  {/* Custom File Input */}
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
                      className="inline-block px-4 py-2 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                  <ErrorMessage name={item.name} component="div" className="text-red-500 text-xs" />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
              >
                {isSubmitting ? "Updating..." : "Update Settings"}
              </button>
              <button
                type="reset"
                className="px-6 py-2.5 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SiteSettingsForm;