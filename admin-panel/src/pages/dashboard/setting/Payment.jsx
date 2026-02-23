import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "../../../context/ThemeContext";
import { getItems, updateItem } from "../../../services/api";

const Payment = () => {
  const { isDarkMode } = useTheme();
  const [initialValues, setInitialValues] = useState({
    razorpay_key_id: "",
    razorpay_key_secret: "",
    currency: "INR",
  });

  // ⭐ GET DATA
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const res = await getItems("setting/payment");
        if (res.data?.data) {
          const d = res.data.data;
          setInitialValues({
            razorpay_key_id: d.razorpay_key_id || "",
            razorpay_key_secret: d.razorpay_key_secret || "",
            currency: d.currency || "INR",
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchPaymentSettings();
  }, []);

  // ⭐ Validation
  const validationSchema = Yup.object().shape({
    razorpay_key_id: Yup.string().required("Razorpay key required"),
    razorpay_key_secret: Yup.string().required("Secret required"),
    currency: Yup.string().required("Currency required"),
  });

  // ⭐ Submit
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateItem("setting/payment", values);
      alert("Payment settings updated successfully!");
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Theme Object matching your Dashboard style
  const theme = {
    input: isDarkMode
      ? "bg-gray-500/5 border-gray-500/20 text-white focus:border-(--primary)"
      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-(--primary)",
    label: isDarkMode ? "text-gray-400" : "text-gray-500",
    sectionTitle: isDarkMode ? "text-(--primary) border-gray-800" : "text-blue-600 border-gray-200",
  };

  return (
    <div className="w-full transition-colors duration-300">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-8">
            {/* Razorpay Section */}
            <div className="space-y-6">
              <div className={`border-b pb-2 ${theme.sectionTitle}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Razorpay Configuration
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                    Razorpay Key ID
                  </label>
                  <Field
                    name="razorpay_key_id"
                    type="text"
                    placeholder="rzp_test_..."
                    className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                        theme.input
                      } ${errors.razorpay_key_id && touched.razorpay_key_id ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="razorpay_key_id" component="div" className="text-red-400 text-[10px] mt-1" />
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                    Razorpay Secret
                  </label>
                  <Field
                    name="razorpay_key_secret"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                        theme.input
                      } ${errors.razorpay_key_secret && touched.razorpay_key_secret ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="razorpay_key_secret" component="div" className="text-red-400 text-[10px] mt-1" />
                </div>
              </div>
            </div>

            {/* Currency Section */}
            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                Currency
              </label>
              <Field 
                as="select" 
                name="currency" 
                className={`w-full md:w-1/2 p-2.5 text-sm rounded-lg border outline-none transition-all cursor-pointer ${theme.input}`}
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </Field>
              <ErrorMessage name="currency" component="div" className="text-red-400 text-[10px] mt-1" />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-gray-800/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-(--primary) hover:opacity-90 text-white px-8 py-2.5 cursor-pointer rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Payment Settings"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Payment;