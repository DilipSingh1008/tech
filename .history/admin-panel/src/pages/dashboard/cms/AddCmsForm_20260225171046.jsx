import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { X } from "lucide-react";
import { createItem, getItems, updateItem } from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const generateSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const AddCmsForm = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

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

  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title:            "",
    slug:             "",
    meta:             "",
    metaDescription:  "",
    shortDescription: "",
    status:           true,
    images:           [],
    existingImages:   [],
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

  useEffect(() => {
    const loadPage = async () => {
      if (isEdit) {
        try {
          const res = await getItems(`cms/${id}`);
          const page = res.data || res;

          setInitialValues({
            title:            page.title            || "",
            slug:             page.slug             || "",
            meta:             page.meta             || "",
            metaDescription:  page.metaDescription  || "",
            shortDescription: page.shortDescription || "",
            status:           page.status !== undefined ? page.status : true,
            images:           [],
            existingImages:   page.images || [],
          });
          

          if (quill) quill.root.innerHTML = page.mainDescription || "";
        } catch (err) {
          console.error("Error loading CMS page:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, isEdit, quill]);

  console.log(initialValues);
  

  const CmsSchema = Yup.object().shape({
    title:            Yup.string().required("Title is required"),
    meta:             Yup.string().required("Meta is required"),
    metaDescription:  Yup.string().required("Meta is required"),
    shortDescription: Yup.string().required("Meta is required"),
    status:           Yup.boolean().required("Meta is required"),
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs">
        Loading...
      </div>
    );

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <header
        className={`px-6 py-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h1 className="text-sm font-bold">
          {isEdit ? "Edit CMS Page" : "Add New CMS Page"}
        </h1>
        <p className="text-[10px] opacity-50">Fill in all required details below</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={CmsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = new FormData();
              data.append("title",            values.title);
              data.append("slug",             generateSlug(values.title));
              data.append("meta",             values.meta);
              data.append("metaDescription",  values.metaDescription);
              data.append("shortDescription", values.shortDescription);
              data.append("mainDescription",  quill?.root.innerHTML || "");
              data.append("status",           values.status);
              data.append("existingImages",   JSON.stringify(values.existingImages));

              if (values.images?.length > 0) {
                values.images.forEach((file) => data.append("images", file));
              }

              if (isEdit) {
                await updateItem(`cms/${id}`, data);
                alert("CMS page updated successfully!");
              } else {
                await createItem("cms/create", data);
                alert("CMS page created successfully!");
              }

              navigate("/dashboard/cms");
            } catch (err) {
              console.error(err);
              alert("Error saving CMS page, check console");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="max-w-4xl mx-auto space-y-6">

              {/* Basic Info */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Page Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className={theme.label}>
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="title"
                      type="text"
                      className={theme.input}
                      onChange={(e) => {
                        setFieldValue("title", e.target.value);
                        setFieldValue("slug", generateSlug(e.target.value));
                      }}
                    />
                    <ErrorMessage name="title" component="div" className={theme.error} />
                  </div>

                  <div>
                    <label className={theme.label}>Slug</label>
                    <Field
                      name="slug"
                      type="text"
                      className={`${theme.input} cursor-not-allowed`}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className={theme.label}>Meta Title</label>
                    <Field name="meta" type="text" className={theme.input} />
                    <ErrorMessage name="meta" component="div" className={theme.error} />
                  </div>

                  <div>
                    <label className={theme.label}>Status</label>
                    <Field
                      name="status"
                      as="select"
                      className={theme.input}
                      onChange={(e) =>
                        setFieldValue("status", e.target.value === "true")
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Field>
                  </div>

                </div>

                <div className="mb-4">
                  <label className={theme.label}>Meta Description</label>
                  <Field
                    name="metaDescription"
                    as="textarea"
                    rows="2"
                    className={theme.input}
                    placeholder="SEO meta description..."
                  />
                  <ErrorMessage name="metaDescription" component="div" className={theme.error} />
                </div>

                <div className="mb-4">
                  <label className={theme.label}>Short Description</label>
                  <Field
                    name="shortDescription"
                    as="textarea"
                    rows="3"
                    className={theme.input}
                    placeholder="Brief summary of the page..."
                  />
                  <ErrorMessage name="shortDescription" component="div" className={theme.error} />
                </div>

                <div>
                  <label className={theme.label}>Main Content</label>
                  <div className="rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800">
                    <div ref={quillRef} className="min-h-[200px]" />
                  </div>
                </div>
              </div>

              {/* Page Images */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Page Images</h2>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={theme.fileInput}
                  onChange={(e) =>
                    setFieldValue("images", Array.from(e.target.files))
                  }
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {values.existingImages?.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 rounded border border-gray-500 overflow-hidden"
                    >
                      <img
                        src={`http://localhost:5000${url}`}
                        alt={`existing-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "existingImages",
                            values.existingImages.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 p-0.5 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {values.images?.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 rounded border border-gray-500 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`new-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[8px] text-center py-0.5">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "images",
                            values.images.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 p-0.5 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 cursor-pointer bg-(--primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              >
                {isSubmitting
                  ? isEdit ? "Updating..." : "Saving..."
                  : isEdit ? "Update Page" : "Publish Page"}
              </button>

            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default AddCmsForm;