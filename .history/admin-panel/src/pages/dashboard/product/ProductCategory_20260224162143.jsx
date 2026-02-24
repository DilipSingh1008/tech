import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem,
} from "../../../services/api";
import Searchbar from "../../../components/Searchbar";

const generateSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const EMPTY_FORM = {
  id: null,
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

const ProductCategory = () => {
  const { isDarkMode } = useTheme();

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border border-gray-800 text-white"
      : "bg-white border border-gray-200 text-gray-700",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-500",
    input:
      "w-full p-2 text-sm rounded border border-gray-700 outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)/30 bg-transparent",
    label: "block text-[10px] font-bold opacity-70 mb-1 uppercase",
    fileInput:
      "w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white hover:file:bg-(--primary) cursor-pointer",
    section: "p-4 md:p-6 rounded-xl border shadow-sm",
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
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

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const pendingQuillHTML = useRef(null);

  // ── Sync Quill → formData, flush any pending HTML on mount ─────────────────
  useEffect(() => {
    if (!quill) return;

    if (pendingQuillHTML.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(pendingQuillHTML.current);
      pendingQuillHTML.current = null;
    }

    const handler = () =>
      setFormData((prev) => ({
        ...prev,
        mainDescription: quill.root.innerHTML,
      }));

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill]);

  // ── Fetch on filter / page change ──────────────────────────────────────────
  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [page, sortBy, order, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await getItems("categories");
      setCategories(res.data.filter((cat) => !cat.catid));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getItems(
        `product-category?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`,
      );
      setProducts(res.data || []);
      if (res.totalPages) setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Sorting handler ─────────────────────────────────────────────────────────
  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
    setPage(1);
  };

  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px]">
      {sortBy === field ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  // ── Category dropdown change ────────────────────────────────────────────────
  const handleCategoryChange = async (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subCategory: "" }));
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    try {
      const res = await getItems("categories");
      setSubCategories(res.data.filter((cat) => cat.catid === categoryId));
    } catch (err) {
      console.error(err);
    }
  };

  // ── Open ADD modal ──────────────────────────────────────────────────────────
  const handleAdd = () => {
    setFormData(EMPTY_FORM);
    setSubCategories([]);
    if (quill) quill.setText("");
    else pendingQuillHTML.current = "";
    setIsModalOpen(true);
  };

  // ── Open EDIT modal ─────────────────────────────────────────────────────────
  const handleEdit = async (prod) => {
    setFormData({
      id: prod._id,
      category: prod.category?._id || "",
      subCategory: prod.subCategory?._id || "",
      name: prod.name,
      slug: prod.slug,
      mrp: prod.price,
      price: prod.salePrice,
      shortDescription: prod.shortDescription || "",
      mainDescription: prod.mainDescription || "",
      images: [],
      existingImages: prod.images || [],
    });

    if (prod.category?._id) {
      try {
        const res = await getItems("categories");
        setSubCategories(
          res.data.filter((cat) => cat.catid === prod.category._id),
        );
      } catch (err) {
        console.error(err);
      }
    }

    const html = prod.mainDescription || "";
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(html);
    } else {
      pendingQuillHTML.current = html;
    }

    setIsModalOpen(true);
  };

  // ── Remove a saved image ────────────────────────────────────────────────────
  const removeExistingImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((u) => u !== url),
    }));
  };

  // ── Save (create or update) ─────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();

    [
      "category",
      "subCategory",
      "name",
      "slug",
      "mrp",
      "price",
      "shortDescription",
    ].forEach((key) => data.append(key, formData[key]));

    data.append(
      "mainDescription",
      quill?.root.innerHTML || formData.mainDescription,
    );
    data.append("existingImages", JSON.stringify(formData.existingImages));
    formData.images.forEach((file) => {
      if (file instanceof File) data.append("images", file);
    });

    try {
      if (formData.id) {
        await updateItem(`product-category/${formData.id}`, data);
      } else {
        await createItem("product-category", data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error saving product. Check console.");
      console.error(err);
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      await patchItem(`product-category/status/${id}`);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: !p.status } : p)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete with confirmation ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setDeleteLoading(true);
      await deleteItem(`product-category/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <header
        className={`px-6 py-4 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <h1 className="text-sm font-bold">Product Catalog Management</h1>
        <p className="text-[10px] opacity-50">
          Manage your categories and product details
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Table */}
          <div
            className={`${theme.card} rounded-xl overflow-hidden shadow-sm`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-16">#</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Product Name <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-1">
                        Category <SortIcon field="category" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Sub Category</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("salePrice")}
                    >
                      <div className="flex items-center gap-1">
                        Offer Price <SortIcon field="salePrice" />
                      </div>
                    </th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Actions</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center opacity-40 italic"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod, index) => (
                      <tr
                        key={prod._id}
                        className="hover:bg-(--primary)/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold">
                          {prod.name}
                        </td>
                        <td className="px-4 py-2.5 opacity-70">
                          {prod.category?.name || "N/A"}
                        </td>
                        <td className="px-4 py-2.5 opacity-70">
                          {prod.subCategory?.name || "N/A"}
                        </td>
                        <td className="px-4 py-2.5">Rs.{prod.salePrice}</td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleStatusToggle(prod._id)}
                            className={`relative inline-flex cursor-pointer h-5 w-9 items-center rounded-full transition-colors ${
                              prod.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${prod.status ? "translate-x-5" : "translate-x-1"}`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(prod)}
                              className="p-1.5 cursor-pointer hover:text-(--primary) hover:bg-(--primary)/10 rounded-md transition-all"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod._id)}
                              className="p-1.5 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-30"
                              title="Delete"
                              disabled={deleteLoading}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`flex items-center justify-between p-3 border-t ${theme.divider}`}
            >
              <span className="text-[11px] opacity-60">
                Showing {products.length} entries
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] rounded-md border transition-all ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary) shadow-sm"
                        : "hover:border-(--primary) hover:text-(--primary) border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal ── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
              className={`${theme.card} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col`}
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase">
                  {formData.id ? "Edit Product" : "Add Product"}
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Categorization & Pricing */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4">
                    Categorization & Pricing
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={theme.label}>Category *</label>
                      <select
                        className={theme.input}
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={theme.label}>Sub-Category</label>
                      <select
                        className={theme.input}
                        value={formData.subCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategory: e.target.value,
                          })
                        }
                        disabled={!formData.category}
                      >
                        <option value="">Select Sub-Category</option>
                        {subCategories.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={theme.label}>Product Name *</label>
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
                        className={theme.input}
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            slug: generateSlug(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={theme.label}>MRP *</label>
                      <input
                        type="number"
                        className={theme.input}
                        value={formData.mrp}
                        onChange={(e) =>
                          setFormData({ ...formData, mrp: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className={theme.label}>Price (Sale) *</label>
                      <input
                        type="number"
                        className={theme.input}
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4">
                    Detailed Description
                  </h2>
                  <div className="mb-4">
                    <label className={theme.label}>Short Summary</label>
                    <textarea
                      className={`${theme.input} h-16`}
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={theme.label}>Main Content</label>
                    <div className="rounded-xl border border-gray-700 p-2 bg-white text-black">
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
                        images: [
                          ...formData.images,
                          ...Array.from(e.target.files),
                        ],
                      })
                    }
                  />

                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.existingImages.map((url) => (
                      <div
                        key={url}
                        className="relative w-20 h-20 rounded-lg border border-gray-700 overflow-hidden"
                      >
                        <img
                          src={`http://localhost:5000/${url.replace(/\\/g, "/")}`}
                          className="w-full h-full object-cover"
                          alt="saved"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-0 right-0 bg-red-500 p-0.5"
                          title="Remove"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {formData.images.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-lg border border-blue-500 overflow-hidden"
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
                              images: formData.images.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="absolute top-0 right-0 bg-red-500 p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-(--primary) text-white rounded-lg text-sm font-bold hover:brightness-110"
                >
                  {formData.id ? "Update Product" : "Publish Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductCategory;