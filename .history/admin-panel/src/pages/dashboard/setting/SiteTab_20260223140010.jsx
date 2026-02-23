import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SiteSettingsForm = () => {
  // Validation Schema
  const validationSchema = Yup.object().shape({
    site_name: Yup.string()
      .min(3, "Too Short!")
      .required("Site name is required"),
    site_address: Yup.string()
      .url("Must be a valid URL (e.g., https://example.com)")
      .required("Site address is required"),
    logo: Yup.mixed().required("A logo is required"),
    favicon: Yup.mixed().required("A favicon is required"),
  });

  const initialValues = {
    site_name: "",
    site_address: "",
    logo: null,
    favicon: null,
  };

  const handleSubmit = (values) => {
    console.log("Form Data:", values);
    alert("Settings Updated Successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Site Name & Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Site Name
                </label>
                <Field
                  name="site_name"
                  placeholder="My Awesome App"
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <ErrorMessage name="site_name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Site Address (URL)
                </label>
                <Field
                  name="site_address"
                  placeholder="https://example.com"
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <ErrorMessage name="site_address" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            {/* Logo & Favicon Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Site Logo</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer text-center">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(event) => setFieldValue("logo", event.currentTarget.files[0])}
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload Logo</p>
                </div>
                <ErrorMessage name="logo" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Favicon Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Favicon</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer text-center">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(event) => setFieldValue("favicon", event.currentTarget.files[0])}
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload Favicon</p>
                </div>
                <ErrorMessage name="favicon" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-4" />

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SiteSettingsForm;