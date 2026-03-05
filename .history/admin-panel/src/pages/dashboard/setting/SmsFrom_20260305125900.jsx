import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "../../../context/ThemeContext";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
} from "../../../redux/api/apiSlice.js";

const SmsForm = () => {
  const { isDarkMode } = useTheme();

  // ── RTK Query: fetch ──
  const { data: res } = useGetItemsQuery("setting/sms");
  const fetchedData = res?.data;

  // ── RTK Query: mutation ──
  const [updateItem] = useUpdateItemMutation();

  // Derived directly from fetched data — no useState needed
  const initialValues = {
    sms_provider: fetchedData?.sms_provider || "",
    sms_api_key: fetchedData?.sms_api_key || "",
    sms_sender_id: fetchedData?.sms_sender_id || "",
  };

  const validationSchema = Yup.object().shape({
    sms_provider: Yup.string().required("Provider required"),
    sms_api_key: Yup.string().required("API key required"),
    sms_sender_id: Yup.string().required("Sender ID required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateItem({ url: "setting/sms", data: values });
      alert("SMS setting updated successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode ? "bg-[#151b28] border-gray-800" : "bg-white border-gray-200",
    input: isDarkMode
      ? "bg-gray-500/5 border-gray-500/20 text-white"
      : "bg-gray-50 border-gray-300 text-gray-900",
    label: isDarkMode ? "text-gray-400" : "text-gray-500",
  };

  const fieldClass = (errors, touched, name) =>
    `w-full p-2.5 text-sm rounded-lg border outline-none focus:border-(--primary) transition-all ${theme.input} ${
      errors[name] && touched[name] ? "border-red-500" : ""
    }`;

  return (
    <div className={`p-6 rounded-xl border shadow-sm ${theme.card}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* SMS Provider */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${theme.label}`}>
                  SMS Provider
                </label>
                <Field
                  name="sms_provider"
                  type="text"
                  placeholder="e.g., Twilio or Fast2SMS"
                  className={fieldClass(errors, touched, "sms_provider")}
                />
                <ErrorMessage name="sms_provider" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* Sender ID */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${theme.label}`}>
                  Sender ID
                </label>
                <Field
                  name="sms_sender_id"
                  type="text"
                  placeholder="MYAPP"
                  className={fieldClass(errors, touched, "sms_sender_id")}
                />
                <ErrorMessage name="sms_sender_id" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* API Key */}
              <div className="md:col-span-2">
                <label className={`block text-[10px] font-bold uppercase mb-1 ${theme.label}`}>
                  SMS API Key
                </label>
                <Field
                  name="sms_api_key"
                  type="password"
                  placeholder="••••••••••••"
                  className={fieldClass(errors, touched, "sms_api_key")}
                />
                <ErrorMessage name="sms_api_key" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSubmitting ? "Saving..." : "Save SMS Settings"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SmsForm;