import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { createItem, getItems, updateItem } from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const generateSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const AddEditServicePage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // ── Permission Logic ──
  const permissions = useSelector((state) => state.permission.permissions);
  const rawServicePermission = permissions?.find(
    (p) => p.module.name === "services"
  );
  const localRole = localStorage.getItem("role");
  const servicePermission =
    localRole === "admin"
      ? { add: true, edit: true, delete: true, view: true }
      : rawServicePermission;

  // ── Redirect if no permission ──
  useEffect(() => {
    if (isEdit && !servicePermission?.edit) {
      navigate("/dashboard/service");
    }
    if (!isEdit && !servicePermission?.add) {
      navigate("/dashboard/service");
    }
  }, [servicePermission]);

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

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    category: "",
    subCategory: "",
    name: "",
    slug: "",
    shortDescription: "",
    galleryImages: [],
    existingGallery: [],
    pdfFile: null,
    existingPdf: null,
    status: true,
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
    const loadData = async () => {
      try {
        const catRes = await getItems("services/active");
        setCategories(catRes.data);

        if (isEdit) {
          const serviceRes = await getItems(`services/${id}`);
          const s = serviceRes.data;

          setInitialValues({
            category: s.category?._id || "",
            subCategory: s.subCategory?._id || "",
            name: s.name || "",
            slug: s.slug || "",
            shortDescription: s.shortDescription || "",
            galleryImages: [],
            existingGallery: s.galleryImages || [],
            pdfFile: null,
            existingPdf: s.pdfFile || null,
            status: s.status,
          });

          if (quill) quill.root.innerHTML = s.description || "";

          if (s.category?._id) {
            const selectedCat = catRes.data.find(
              (cat) => cat._id === s.category._id
            );
            setSubCategories(selectedCat?.subCategories || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, quill]);

  const handleCategoryChange = (categoryId, setFieldValue) => {
    setFieldValue("category", categoryId);
    setFieldValue("subCategory", "");
    const cat = categories.find((c) => c._id === categoryId);
    const activeSubs = cat?.subCategories?.filter((sub) => sub.status) || [];
    setSubCategories(activeSubs);
  };

  const ServiceSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    subCategory: Yup.string().required("Sub-Category is required"),
    name: Yup.string().required("Service Name is required"),
    shortDescription: Yup.string().required("Short description is required"),
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs">
        Loading...
      </div>
    );

  // ── No permission fallback UI ──
  if (isEdit && !servicePermission?.edit) {
    return (
      <div className="flex h-screen items-center justify-center text-xs opacity-50">
        You don't have permission to edit services.
      </div>
    );
  }

  if (!isEdit && !servicePermission?.add) {
    return (
      <div className="flex h-screen items-center justify-center text-xs opacity-50">
        You don't have permission to add services.
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <header
        className={`px-6 py-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h1 className="text-sm font-bold">
          {isEdit ? "Edit Service" : "Add New Service"}
        </h1>
        <p className="text-[10px] opacity-50">
          Fill in all required details below
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ServiceSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("category", values.category);
              formData.append("subCategory", values.subCategory);
              formData.append("name", values.name);
              formData.append("slug", generateSlug(values.name));
              formData.append("shortDescription", values.shortDescription);
              formData.append("description", quill?.root.innerHTML || "");
              formData.append("status", values.status);

              if (values.galleryImages?.length > 0) {
                values.galleryImages.forEach((file) =>
                  formData.append("galleryImages", file)
                );
              }

              if (values.pdfFile) {
                formData.append("pdfFile", values.pdfFile);
              }

              if (isEdit) {
                await updateItem(`services/${id}`, formData);
                alert("Service updated successfully!");
              } else {
                await createItem("services", formData);
                alert("Service created successfully!");
              }

              navigate("/dashboard/service");
            } catch (err) {
              console.error(err);
              alert("Error saving service, check console");
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
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="category"
                      as="select"
                      className={theme.input}
                      onChange={(e) =>
                        handleCategoryChange(e.target.value, setFieldValue)
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className={theme.error}
                    />
                  </div>

                  <div>
                    <label className={theme.label}>
                      Sub-Category <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="subCategory"
                      as="select"
                      className={theme.input}
                      disabled={!values.category}
                    >
                      <option value="">Select Sub-Category</option>
                      {subCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="subCategory"
                      component="div"
                      className={theme.error}
                    />
                  </div>

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
                      className={`${theme.input} cursor-not-allowed`}
                      readOnly
                    />
                  </div>
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

                <div>
                  <label className={theme.label}>Description</label>
                  <div className="rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800">
                    <div ref={quillRef} className="min-h-[200px]" />
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Media Upload</h2>

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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {values.existingGallery?.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:5000/${img}`}
                        alt={`existing-${idx}`}
                        className="h-16 w-16 object-cover rounded border border-gray-500"
                      />
                    ))}
                    {values.galleryImages?.map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt={`new-${idx}`}
                        className="h-16 w-16 object-cover rounded border border-gray-500"
                      />
                    ))}
                  </div>
                </div>

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
                  {values.existingPdf && (
                    <div className="mt-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      Existing: {values.existingPdf.split("/").pop()}
                    </div>
                  )}
                  {values.pdfFile && (
                    <div className="mt-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      New: {values.pdfFile.name}
                    </div>
                  )}
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
                  ? "Update Service"
                  : "Add Service"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default AddEditServicePage;