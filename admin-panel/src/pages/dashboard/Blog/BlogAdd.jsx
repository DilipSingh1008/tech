import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { X } from "lucide-react";
import { createItem, getItems, updateItem } from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const BlogForm = () => {
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
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: "",
    shortDescription: "",
    mainDescription: "",
    categoryId: "",
    images: [],
    existingImages: [],
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getItems("blogs/active");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blog if editing
  useEffect(() => {
    const fetchBlog = async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const res = await getItems(`blogs/${id}`);
        const blog = res;

        setInitialValues({
          title: blog.title || "",
          shortDescription: blog.shortDescription || "",
          mainDescription: blog.mainDescription || "",
          categoryId: blog.categoryId?._id || "",
          images: [],
          existingImages: blog.images || [],
        });

        if (quill) quill.root.innerHTML = blog.mainDescription || "";
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isEdit, quill]);

  const BlogSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    shortDescription: Yup.string().required("Short description is required"),
    categoryId: Yup.string().required("Category is required"),
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
          {isEdit ? "Edit Blog" : "Add New Blog"}
        </h1>
        <p className="text-[10px] opacity-50">
          Fill in all required details below
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={BlogSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = new FormData();
              data.append("title", values.title);
              data.append("shortDescription", values.shortDescription);
              data.append("mainDescription", quill?.root.innerHTML || "");
              data.append("categoryId", values.categoryId);
              data.append("folder", "blogimage");

              values.images?.forEach((file) => data.append("images", file));
              data.append(
                "existingImages",
                JSON.stringify(values.existingImages),
              );

              if (isEdit) {
                await updateItem(`blogs/${id}`, data);
              } else {
                await createItem("blogs", data);
              }

              navigate("/dashboard/manage-blog");
            } catch (err) {
              console.error(err);
              alert("Error saving blog, check console");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="max-w-4xl mx-auto space-y-6">
              {/* Blog Details */}
              <div className={`${theme.section} ${theme.card}`}>
                <div className="mb-4">
                  <label className={theme.label}>
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Field name="title" type="text" className={theme.input} />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className={theme.error}
                  />
                </div>

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

                <div className="mb-4">
                  <label className={theme.label}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Field as="select" name="categoryId" className={theme.input}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className={theme.error}
                  />
                </div>

                <div>
                  <label className={theme.label}>Description</label>
                  <div
                    className={`rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800`}
                  >
                    <div ref={quillRef} className="min-h-[200px]" />
                  </div>
                </div>
              </div>

              {/* Blog Images */}
              <div className={`${theme.section} ${theme.card}`}>
                <label className={theme.label}>Images</label>
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
                  {/* Existing Images */}
                  {values.existingImages?.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 rounded border border-gray-500 overflow-hidden"
                    >
                      <img
                        src={`http://localhost:5000/uploads/${url.replace(
                          /\\/g,
                          "/",
                        )}`}
                        alt={`existing-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "existingImages",
                            values.existingImages.filter((_, i) => i !== idx),
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 p-0.5 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
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
                            values.images.filter((_, i) => i !== idx),
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
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                    ? "Update Blog"
                    : "Publish Blog"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default BlogForm;
