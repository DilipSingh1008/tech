import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from "../../../context/ThemeContext";
import { getItems, updateItem } from '../../../services/api';

const MailForm = () => {
  const { isDarkMode } = useTheme();
  const [initialValues, setInitialValues] = useState({
    mail_host: '',
    mail_port: '',
    mail_user: '',
    mail_pass: '',
    mail_from: '',
  });

  // 1. GET DATA
  useEffect(() => {
    const fetchMailSettings = async () => {
      try {
        const response = await getItems('setting/mail');
        if (response.data) {
          setInitialValues({
            mail_host: response.data.mail_host || '',
            mail_port: response.data.mail_port || '',
            mail_user: response.data.mail_user || '',
            mail_pass: response.data.mail_pass || '',
            mail_from: response.data.mail_from || '',
          });
        }
      } catch (error) {
        console.error("Error fetching mail settings:", error);
      }
    };
    fetchMailSettings();
  }, []);

  const validationSchema = Yup.object().shape({
    mail_host: Yup.string().required('Host is required'),
    mail_port: Yup.number().typeError('Port must be a number').required('Port is required'),
    mail_user: Yup.string().required('Username is required'),
    mail_pass: Yup.string().required('Password is required'),
    mail_from: Yup.string().email('Invalid email address').required('From Email is required'),
  });

  // 2. UPDATE DATA
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateItem('setting/mail', values);
      alert("Mail settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
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
  };

  return (
    <div className="w-full transition-colors duration-300">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true} 
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mail Host - Span 2 columns for visibility */}
              <div className="md:col-span-2">
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Mail Host (SMTP)
                </label>
                <Field
                  name="mail_host"
                  placeholder="smtp.mailtrap.io"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                    theme.input
                  } ${errors.mail_host && touched.mail_host ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="mail_host" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* Mail User */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Mail Username
                </label>
                <Field
                  name="mail_user"
                  placeholder="Your SMTP username"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                    theme.input
                  } ${errors.mail_user && touched.mail_user ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="mail_user" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* Mail Password */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Mail Password
                </label>
                <Field
                  name="mail_pass"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                    theme.input
                  } ${errors.mail_pass && touched.mail_pass ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="mail_pass" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* Mail Port */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Mail Port
                </label>
                <Field
                  name="mail_port"
                  placeholder="587"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                    theme.input
                  } ${errors.mail_port && touched.mail_port ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="mail_port" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

              {/* Mail From */}
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Mail From Address
                </label>
                <Field
                  name="mail_from"
                  type="email"
                  placeholder="noreply@example.com"
                  className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                    theme.input
                  } ${errors.mail_from && touched.mail_from ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="mail_from" component="div" className="text-red-400 text-[10px] mt-1" />
              </div>

            </div>

            <div className="pt-4 border-t border-gray-800/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-(--primary) hover:opacity-90 text-white px-8 py-2.5 cursor-pointer rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Update Mail Settings'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MailForm;