import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from "../../../context/ThemeContext";
import { getItems, updateItem } from '../../../services/api';

const SocialForms = () => {
  const { isDarkMode } = useTheme();
  const [initialValues, setInitialValues] = useState({
    facebook_link: '',
    twitter_link: '',
    instagram_link: '',
    linkedin_link: '',
  });

  // 1. GET DATA
  useEffect(() => {
    const fetchSocialSettings = async () => {
      try {
        const response = await getItems('setting/social');
        if (response.data) {
          setInitialValues({
            facebook_link: response.data.facebook_link || '',
            twitter_link: response.data.twitter_link || '',
            instagram_link: response.data.instagram_link || '',
            linkedin_link: response.data.linkedin_link || '',
          });
        }
      } catch (error) {
        console.error("Error fetching social settings:", error);
      }
    };
    fetchSocialSettings();
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    facebook_link: Yup.string().url('Invalid URL').nullable(),
    twitter_link: Yup.string().url('Invalid URL').nullable(),
    instagram_link: Yup.string().url('Invalid URL').nullable(),
    linkedin_link: Yup.string().url('Invalid URL').nullable(),
  });

  // 2. UPDATE DATA
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateItem('setting/social', values);
      alert("Social links updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Theme Object
  const theme = {
    input: isDarkMode
      ? "bg-gray-500/5 border-gray-500/20 text-white focus:border-(--primary)"
      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-(--primary)",
    label: isDarkMode ? "text-gray-400" : "text-gray-500",
  };

  const socialFields = [
    { name: 'facebook_link', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
    { name: 'twitter_link', label: 'Twitter (X) URL', placeholder: 'https://x.com/...' },
    { name: 'instagram_link', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
    { name: 'linkedin_link', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
  ];

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
              
              {socialFields.map((field) => (
                <div key={field.name}>
                  <label 
                    htmlFor={field.name} 
                    className={`block text-[10px] font-bold uppercase mb-1 tracking-wider transition-colors ${theme.label}`}
                  >
                    {field.label}
                  </label>
                  <Field
                    name={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    className={`w-full p-2.5 text-sm rounded-lg border outline-none transition-all ${
                      theme.input
                    } ${errors[field.name] && touched[field.name] ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage 
                    name={field.name} 
                    component="div" 
                    className="text-red-400 text-[10px] mt-1 font-medium" 
                  />
                </div>
              ))}

            </div>

            <div className="pt-4 border-t border-gray-800/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-(--primary) hover:opacity-90 text-white px-8 py-2.5 cursor-pointer rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Update Social Links'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SocialForms;