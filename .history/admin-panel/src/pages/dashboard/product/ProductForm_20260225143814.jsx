import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { getItems, createItem, updateItem } from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const generateSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const EMPTY_FORM = {
  category: "",
  subCategory: "",
  name: "",
  slug: "",
  mrp: "",
  price: "",
  shortDescription: "",
  mainDescription: "",
  images: [],
  existingImages: [],
};

const ProductForm = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

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
    fileInput:
      "w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white hover:file:bg-(--primary) cursor-pointer",
    section: "p-4 md:p-6 rounded-xl border shadow-sm",
  };

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
  const [formData, setFormData] = useState(EMPTY_FORM);

  const pendingQuillHTML = useRef(null);

  // ── Sync Quill → formData ──────────────────────────────────────────────────
  useEffect(() => {
    if (!quill) return;
    if (pendingQuillHTML.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(pendingQuillHTML.current);
      pendingQuillHTML.current = null;
    }
    const handler = () =>
      setFormData((prev) => ({ ...prev, mainDescription: quill.root.innerHTML }));
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill]);

  // ── Load categories & product (edit mode) ─────────────────────────────────
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getItems("categories");
        setCategories(res.data.filter((cat) => !cat.catid));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const loadProduct = async () => {
      if (isEdit) {
        try {
          const res = await getItems(`product-category/${id}`);
          const prod = res.data;

          setFormData({
            category: prod.category?._id || "",
            subCategory: prod.subCategory?._id || "",
            name: prod.name || "",
            slug: prod.slug || "",
            mrp: prod.price || "",
            price: prod.salePrice || "",
            shortDescription: prod.shortDescription || "",
            mainDescription: prod.mainDescription || "",
            images: [],
            existingImages: prod.images || [],
          });

          const html = prod.mainDescription || "";
          if (quill) quill.clipboard.dangerouslyPasteHTML(html);
          else pendingQuillHTML.current = html;

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

  const handleCategoryChange = async (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subCategory: "" }));
    if (!categoryId) { setSubCategories([]); return; }
    try {
      const res = await getItems("categories");
      setSubCategories(res.data.filter((cat) => cat.catid === categoryId));
    } catch (err) {
      console.error(err);
      setSubCategories([]);
    }
  };

  const removeExistingImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((u) => u !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    ["category", "subCategory", "name", "slug", "mrp", "price", "shortDescription"].forEach(
      (key) => data.append(key, formData[key])
    );
    data.append("mainDescription", quill?.root.innerHTML || formData.mainDescription);
    data.append("existingImages", JSON.stringify(formData.existingImages));
    formData.images.forEach((file) => {
      if (file instanceof File) data.append("images", file);
    });

    try {
      if (isEdit) {
        await updateItem(`product-category/${id}`, data);
        alert("Product updated successfully!");
      } else {
        await createItem("product-category", data);
        alert("Product created successfully!");
      }
      navigate("/dashboard/products");
    } catch (err) {
      alert("Error saving product. Check console.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs">
        Loading...
      </div>
    );

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      {/* Header */}
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">

          {/* Categorization & Pricing */}
          <div className={`${theme.section} ${theme.card}`}>
            <h2 className="text-xs font-bold mb-4">Categorization & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className={theme.label}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={theme.input}
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={theme.label}>Sub-Category</label>
                <select
                  className={theme.input}
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  disabled={!formData.category}
                >
                  <option value="">Select Sub-Category</option>
                  {subCategories.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={theme.label}>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={theme.input}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className={theme.label}>Slug</label>
                <input
                  type="text"
                  className={`${theme.input} cursor-not-allowed`}
                  value={formData.slug}
                  readOnly
                />
              </div>

              <div>
                <label className={theme.label}>
                  MRP <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={theme.input}
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className={theme.label}>
                  Price (Sale) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={theme.input}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

            </div>
          </div>

          {/* Description */}
          <div className={`${theme.section} ${theme.card}`}>
            <h2 className="text-xs font-bold mb-4">Detailed Description</h2>
            <div className="mb-4">
              <label className={theme.label}>
                Short Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                className={theme.input}
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className={theme.label}>Main Content</label>
              <div className={`rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800`}>
                <div ref={quillRef} className="min-h-[200px]" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={`${theme.section} ${theme.card}`}>
            <h2 className="text-xs font-bold mb-4">Product Images</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              className={theme.fileInput}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  images: [...formData.images, ...Array.from(e.target.files)],
                })
              }
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.existingImages.map((url) => (
                <div
                  key={url}
                  className="relative h-16 w-16 rounded border border-gray-500 overflow-hidden"
                >
                  <img
                    src={`http://localhost:5000/${url.replace(/\\/g, "/")}`}
                    className="w-full h-full object-cover"
                    alt="saved"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-0 right-0 bg-red-500 p-0.5 cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {formData.images.map((file, idx) => (
                <div
                  key={idx}
                  className="relative h-16 w-16 rounded border border-gray-500 overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                    alt="new"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[8px] text-center py-0.5">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => i !== idx),
                      })
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
            className="w-full py-3 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          >
            {isEdit ? "Update Product" : "Publish Product"}
          </button>

        </form>
      </main>
    </div>
  );
};

export default ProductForm;