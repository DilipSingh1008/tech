import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { createItem } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const generateSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const AddServicePage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
    },
  });

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border border-gray-800 text-white"
      : "bg-white border border-gray-200 text-gray-700",
    input:
      "w-full p-2 text-sm rounded border outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)/30",
    label: "block text-[10px] font-bold opacity-70 mb-1 uppercase",
    error: "text-red-500 text-[10px] mt-1",
    fileInput:
      "w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white hover:file:bg-(--primary) cursor-pointer",
    section: "p-4 md:p-6 rounded-xl border shadow-sm",
  };

  const ServiceSchema = Yup.object().shape({
    name: Yup.string().required("Service Name is required"),
    shortDescription: Yup.string().required("Short description is required"),
    featuredImage: Yup.mixed().required("Featured image is required"),
  });

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      {/* Header */}
      <header
        className={`px-6 py-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h1 className="text-sm font-bold">Add New Service</h1>
        <p className="text-[10px] opacity-50">
          Fill in all required details below
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Formik
          initialValues={{
            name: "",
            slug: "",
            shortDescription: "",
            featuredImage: null,
            bannerImage: null,
            status: true,
          }}
          validationSchema={ServiceSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("slug", generateSlug(values.name));
              formData.append("shortDescription", values.shortDescription);
              formData.append("description", quill?.root.innerHTML || "");
              if (values.featuredImage)
                formData.append("featuredImage", values.featuredImage);
              formData.append("status", values.status);
              await createItem("service", formData);
              alert("Service created successfully!");
              navigate("/dashboard/services");
            } catch (err) {
              console.error(err);
              alert("Error creating service, check console");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="max-w-4xl mx-auto space-y-6">
              {/* Basic Info */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={theme.label}>
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className={theme.input}
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                        setFieldValue("slug", generateSlug(e.target.value));
                      }}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className={theme.error}
                    />
                  </div>
                  <div>
                    <label className={theme.label}>Slug</label>
                    <Field
                      name="slug"
                      type="text"
                      className={`${theme.input}  cursor-not-allowed`}
                      readOnly
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="mb-4">
                  <label className={theme.label}>
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="shortDescription"
                    as="textarea"
                    rows="3"
                    className={theme.input}
                  />
                  <ErrorMessage
                    name="shortDescription"
                    component="div"
                    className={theme.error}
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className={theme.label}>Description</label>
                  <div
                    className={`rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800`}
                  >
                    <div ref={quillRef} className="min-h-[200px]" />
                  </div>
                </div>
              </div>

              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Media Upload</h2>

                {/* Featured Image (Single) */}
                <div className="mb-4">
                  <label className={theme.label}>
                    Featured Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={theme.fileInput}
                    onChange={(e) =>
                      setFieldValue("featuredImage", e.target.files[0])
                    }
                  />
                  <ErrorMessage
                    name="featuredImage"
                    component="div"
                    className={theme.error}
                  />
                </div>

                {/* Gallery Images (Multiple) */}
                <div className="mb-4">
                  <label className={theme.label}>Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={theme.fileInput}
                    onChange={(e) =>
                      setFieldValue("galleryImages", Array.from(e.target.files))
                    }
                  />
                  {values.galleryImages && values.galleryImages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {values.galleryImages.map((file, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDF Upload */}
                <div className="mb-4">
                  <label className={theme.label}>Upload PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className={theme.fileInput}
                    onChange={(e) =>
                      setFieldValue("pdfFile", e.target.files[0])
                    }
                  />
                  {values.pdfFile && (
                    <div className="mt-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {values.pdfFile.name}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              >
                {isSubmitting ? "Adding..." : "Add Service"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default AddServicePage;
