import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../../services/api";
import Searchbar from "../../../components/Searchbar";

const generateSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const ProductCategory = () => {
  const { isDarkMode } = useTheme();

  // 1. Theme Object (Exact copy from your reference code)
  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border border-gray-800 text-white"
      : "bg-white border border-gray-200 text-gray-700",
    input:
      "w-full p-2 text-sm rounded border outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)/30 bg-transparent",
    label: "block text-[10px] font-bold opacity-70 mb-1 uppercase",
    error: "text-red-500 text-[10px] mt-1",
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

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
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
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
    fetchInitialCategories();
  }, [page, searchQuery]);

  const fetchInitialCategories = async () => {
    try {
      const res = await getItems("product-category?limit=100");
      const topCats = res.data.filter((cat) => cat.catid === null);
      setCategories(topCats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subCategory: "" }));
    try {
      const res = await getItems("product-category?limit=100");
      const filteredSubs = res.data.filter((cat) => cat.catid === categoryId);
      setSubCategories(filteredSubs);
    } catch (err) {
      setSubCategories([]);
    }
  };

  const fetchData = async () => {
    try {
      let url = `products?page=${page}&limit=8&search=${searchQuery}`;
      const res = await getItems(url);
      setProducts(res.data || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "id") data.append(key, formData[key]);
    });
    data.append("mainDescription", quill?.root.innerHTML || "");
    formData.images.forEach((file) => {
      if (file instanceof File) data.append("images", file);
    });

    try {
      if (formData.id) {
        await updateItem(`products/${formData.id}`, data);
      } else {
        await createItem("products", data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error saving product");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      {/* Header matching AddServicePage */}
      <header className={`px-6 py-4 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <h1 className="text-sm font-bold">Product Category Management</h1>
        <p className="text-[10px] opacity-50">Manage your product catalog and classifications</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
            <button
              onClick={() => {
                setFormData({ id: null, category: "", subCategory: "", name: "", slug: "", mrp: "", price: "", shortDescription: "", mainDescription: "", images: [] });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Table list */}
          <div className={`${theme.card} rounded-xl overflow-hidden`}>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase font-bold ${isDarkMode ? "bg-[#1f2637]" : "bg-gray-100"}`}>
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{prod.name}</td>
                    <td className="px-6 py-4 opacity-70">{prod.category?.name || "N/A"}</td>
                    <td className="px-6 py-4">₹{prod.price}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setFormData({ ...prod, id: prod._id, images: [] });
                          handleCategoryChange(prod.category?._id);
                          setIsModalOpen(true);
                        }} 
                        className="p-1.5 hover:text-(--primary)"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => deleteItem(`products/${prod._id}`).then(fetchData)} className="p-1.5 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal following AddServicePage UI */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`${theme.card} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col`}>
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase">{formData.id ? "Edit" : "Add"} Product</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Basic Info Section */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4">Basic Information</h2>
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
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={theme.label}>Sub-Category *</label>
                      <select 
                        className={theme.input} 
                        value={formData.subCategory} 
                        onChange={(e) => setFormData({...formData, subCategory: e.target.value})} 
                        disabled={!formData.category}
                        required
                      >
                        <option value="">Select Sub-Category</option>
                        {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={theme.label}>Product Name *</label>
                      <input 
                        type="text" 
                        className={theme.input} 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value, slug: generateSlug(e.target.value)})} 
                        required 
                      />
                    </div>
                    <div>
                      <label className={theme.label}>Slug</label>
                      <input type="text" className={`${theme.input} opacity-50`} value={formData.slug} readOnly />
                    </div>
                    <div>
                      <label className={theme.label}>MRP</label>
                      <input type="number" className={theme.input} value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: e.target.value})} />
                    </div>
                    <div>
                      <label className={theme.label}>Sale Price *</label>
                      <input type="number" className={theme.input} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4">Descriptions</h2>
                  <div className="mb-4">
                    <label className={theme.label}>Short Description</label>
                    <textarea className={`${theme.input} h-20`} value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} />
                  </div>
                  <div>
                    <label className={theme.label}>Main Description</label>
                    <div className="rounded-xl border p-2 bg-white dark:bg-[#151b28] dark:border-gray-800">
                      <div ref={quillRef} className="min-h-[200px]" />
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4">Media Upload</h2>
                  <input 
                    type="file" 
                    multiple 
                    className={theme.fileInput} 
                    onChange={(e) => setFormData({...formData, images: [...formData.images, ...Array.from(e.target.files)]})} 
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg border border-gray-700 overflow-hidden">
                        <img src={img instanceof File ? URL.createObjectURL(img) : img} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                          className="absolute top-0 right-0 bg-red-500 p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:opacity-90">
                  {formData.id ? "Update Product" : "Add Product"}
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