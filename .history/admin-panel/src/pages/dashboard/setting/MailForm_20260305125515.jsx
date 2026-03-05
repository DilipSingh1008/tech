import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from "../../../context/ThemeContext";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
} from '../../../redux/api/apiSlice.js';

const MailForm = () => {
  const { isDarkMode } = useTheme();

  // ── RTK Query: fetch ──
  const { data: res } = useGetItemsQuery('setting/mail');
  const fetchedData = res?.data;

  // ── RTK Query: mutation ──
  const [updateItem] = useUpdateItemMutation();

  // Derived directly from fetched data — no useState needed
  const initialValues = {
    mail_host: fetchedData?.mail_host || '',
    mail_port: fetchedData?.mail_port || '',
    mail_user: fetchedData?.mail_user || '',
    mail_pass: fetchedData?.mail_pass || '',
    mail_from: fetchedData?.mail_from || '',
  };

  const validationSchema = Yup.object().shape({
    mail_host: Yup.string().required('Host is required'),
    mail_port: Yup.number().typeError('Port must be a number').required('Port is required'),
    mail_user: Yup.string().required('Username is required'),
    mail_pass: Yup.string().required('Password is required'),
    mail_from: Yup.string().email('Invalid email address').required('From Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateItem({ url: 'setting/mail', data: values });
      alert("Mail settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const theme = {
    input: isDarkMode
      ? "bg-gray-500/5 border-gray-500/20 text-white focus:border-(--primary)"
      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-(--primary)",
    label: isDarkMode ? "text-gray-400" : "text-gray-500",
  };

  const fieldClass = (errors, touched, name) =>
    `w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${theme.input} ${
      errors[name] && touched[name] ? "border-red-500" : ""
    }`;

  return (
    <div className="w-full transition-colors duration-300">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Mail Host */}
              <div className="md:col-span-2">
                <label className={`block text-[10px] font-bold uppercase mb-1 tracking-wider ${theme.label}`}>
                  Mail Host (SMTP)
                </label>
                <Field
                  name="mail_host"
                  placeholder="smtp.mailtrap.io"
                  className={fieldClass(errors, touched, 'mail_host')}
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
                  className={fieldClass(errors, touched, 'mail_user')}
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
                  className={fieldClass(errors, touched, 'mail_pass')}
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
                  className={fieldClass(errors, touched, 'mail_port')}
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
                  className={fieldClass(errors, touched, 'mail_from')}
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