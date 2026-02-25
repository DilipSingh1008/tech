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

const ProductForm = () => {
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

  const [categories, setCategories]       = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading]             = useState(true);

  const [initialValues, setInitialValues] = useState({
    category:         "",
    subCategory:      "",
    name:             "",
    slug:             "",
    mrp:              "",
    price:            "",
    shortDescription: "",
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
    const loadCategories = async () => {
      try {
        const res = await getItems("categories");
        setCategories(res.data.filter((cat) => cat.catid === null));
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };

    const loadProduct = async () => {
      if (isEdit) {
        try {
          const res = await getItems(`product-category/${id}`);

          // ── DEBUG: poora response dekho console mein ──────────────────────
          console.log("Full API response:", res);
          console.log("res.data:", res.data);

          // Backend alag alag structure mein data bhejta hai
          // res.data ya res.data.data ya res.data.product — sab handle karo
          const prod = res.data?.data || res.data?.product || res.data;

          console.log("Extracted prod object:", prod);
          console.log("Fields check → name:", prod?.name, "| mrp:", prod?.mrp, "| price:", prod?.price, "| salePrice:", prod?.salePrice);

          setInitialValues({
            category:         prod.category?._id    || "",
            subCategory:      prod.subCategory?._id || "",
            name:             prod.name             || "",
            slug:             prod.slug             || "",
            // mrp → backend mein 'mrp' ya 'price' ho sakta hai
            mrp:              prod.mrp   || prod.price     || "",
            // salePrice → backend mein 'salePrice' ya 'price' ho sakta hai
            price:            prod.salePrice || prod.price || "",
            shortDescription: prod.shortDescription || "",
            images:           [],
            existingImages:   prod.images || [],
          });

          if (quill) quill.root.innerHTML = prod.mainDescription || "";

          if (prod.category?._id) {
            const allCats = await getItems("categories");
            setSubCategories(
              allCats.data.filter((c) => c.catid === prod.category._id)
            );
          }
        } catch (err) {
          console.error("Error loading product:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadCategories();
    loadProduct();
  }, [id, isEdit, quill]);

  const handleCategoryChange = async (categoryId, setFieldValue) => {
    setFieldValue("category", categoryId);
    setFieldValue("subCategory", "");
    try {
      const res = await getItems("categories");
      setSubCategories(res.data.filter((c) => c.catid === categoryId));
    } catch (err) {
      console.error(err);
      setSubCategories([]);
    }
  };

  const ProductSchema = Yup.object().shape({
    category:         Yup.string().required("Category is required"),
    subCategory:      Yup.string().required("Sub-Category is required"),
    name:             Yup.string().required("Product Name is required"),
    mrp:              Yup.string().required("MRP is required"),
    price:            Yup.string().required("Sale Price is required"),
    shortDescription: Yup.string().required("Short description is required"),
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
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-[10px] opacity-50">Fill in all required details below</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = new FormData();
              data.append("category",         values.category);
              data.append("subCategory",      values.subCategory);
              data.append("name",             values.name);
              data.append("slug",             generateSlug(values.name));
              data.append("mrp",              values.mrp);
              data.append("price",            values.price);
              data.append("shortDescription", values.shortDescription);
              data.append("mainDescription",  quill?.root.innerHTML || "");
              data.append("existingImages",   JSON.stringify(values.existingImages));

              if (values.images?.length > 0) {
                values.images.forEach((file) => data.append("images", file));
              }

              if (isEdit) {
                await updateItem(`product-category/${id}`, data);
                alert("Product updated successfully!");
              } else {
                await createItem("product-category", data);
                alert("Product created successfully!");
              }

              navigate("/dashboard/products");
            } catch (err) {
              console.error(err);
              alert("Error saving product, check console");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="max-w-4xl mx-auto space-y-6">

              {/* Categorization & Pricing */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Categorization & Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className={theme.label}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="category"
                      as="select"
                      className={theme.input}
                      onChange={(e) => handleCategoryChange(e.target.value, setFieldValue)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="category" component="div" className={theme.error} />
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
                      {subCategories.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="subCategory" component="div" className={theme.error} />
                  </div>

                  <div>
                    <label className={theme.label}>
                      Product Name <span className="text-red-500">*</span>
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
                    <ErrorMessage name="name" component="div" className={theme.error} />
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
                    <label className={theme.label}>
                      MRP <span className="text-red-500">*</span>
                    </label>
                    <Field name="mrp" type="number" className={theme.input} />
                    <ErrorMessage name="mrp" component="div" className={theme.error} />
                  </div>

                  <div>
                    <label className={theme.label}>
                      Price (Sale) <span className="text-red-500">*</span>
                    </label>
                    <Field name="price" type="number" className={theme.input} />
                    <ErrorMessage name="price" component="div" className={theme.error} />
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
                  <ErrorMessage name="shortDescription" component="div" className={theme.error} />
                </div>

                <div>
                  <label className={theme.label}>Main Description</label>
                  <div className={`rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800`}>
                    <div ref={quillRef} className="min-h-[200px]" />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Product Images</h2>

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
                        src={`http://localhost:5000/${url.replace(/\\/g, "/")}`}
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
                className="w-full py-3 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              >
                {isSubmitting
                  ? isEdit ? "Updating..." : "Adding..."
                  : isEdit ? "Update Product" : "Publish Product"}
              </button>

            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default ProductForm;