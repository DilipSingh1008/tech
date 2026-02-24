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

  // 1. Initialize useQuill
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

  // Sync Quill content
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          mainDescription: quill.root.innerHTML,
        }));
      });
    }
  }, [quill]);

  // Update Quill on Edit
  useEffect(() => {
    if (quill && isModalOpen) {
      if (formData.id) {
        quill.clipboard.dangerouslyPasteHTML(formData.mainDescription || "");
      } else {
        quill.setText("");
      }
    }
  }, [quill, isModalOpen, formData.id]);

  // Pagination & Sorting logic
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [page, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await getItems("product-category?limit=100");
      // Filter for top-level categories (catid === null)
      const topCats = res.data.filter((cat) => cat.catid === null);
      setCategories(topCats);
    } catch (err) {
      console.error("Error fetching categories", err);
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
      let url = `products?page=${page}&limit=${limit}&search=${searchQuery}`;
      const res = await getItems(url);
      setProducts(res.data || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "id") {
        data.append(key, formData[key]);
      }
    });

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
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.error || "Failed to save product");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null, category: "", subCategory: "", name: "",
      slug: "", mrp: "", price: "", shortDescription: "",
      mainDescription: "", images: [],
    });
  };

  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode ? "bg-[#151b28] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-700",
    header: isDarkMode ? "bg-[#1f2637] text-gray-400 border-gray-800" : "bg-gray-100 text-gray-500 border-gray-200",
    input: "w-full p-2 text-sm rounded border outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)/30 bg-transparent",
    label: "block text-[10px] font-bold opacity-70 mb-1 uppercase",
    section: "p-4 md:p-6 rounded-xl border shadow-sm mb-6",
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <header className={`px-6 py-4 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <h1 className="text-sm font-bold uppercase tracking-wider">Product Management</h1>
        <p className="text-[10px] opacity-50">View and manage your product catalog</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Table Card */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase font-bold border-b ${theme.header}`}>
                  <tr>
                    <th className="px-6 py-4">Product Info</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price / MRP</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-blue-500/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm group-hover:text-blue-500 transition-colors">{prod.name}</div>
                        <div className="text-[10px] opacity-50 truncate max-w-[200px]">{prod.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-medium">
                          {prod.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">₹{prod.price}</div>
                        <div className="text-[10px] opacity-40 line-through">₹{prod.mrp}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                             onClick={() => { 
                               setFormData({...prod, id: prod._id, images: prod.images || []}); 
                               setIsModalOpen(true); 
                               handleCategoryChange(prod.category?._id);
                             }} 
                             className="p-2 rounded-md hover:bg-blue-500/20 text-blue-500 transition-all"
                          >
                            <Edit3 size={16}/>
                          </button>
                          <button 
                             onClick={() => { if(window.confirm("Delete this product?")) deleteItem(`products/${prod._id}`).then(fetchData)}} 
                             className="p-2 rounded-md hover:bg-red-500/20 text-red-400 transition-all"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`p-4 flex items-center justify-between border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
               <span className="text-[10px] opacity-50 uppercase font-bold">Page {page} of {totalPages}</span>
               <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-1 hover:bg-gray-500/10 rounded disabled:opacity-20"><ChevronLeft size={18}/></button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="p-1 hover:bg-gray-500/10 rounded disabled:opacity-20"><ChevronRight size={18}/></button>
               </div>
            </div>
          </div>
        </div>

        {/* Modal - Redesigned to match AddServicePage */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`${theme.card} rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl`}>
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1c2435]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{formData.id ? "Edit Product" : "Create New Product"}</h3>
                  <p className="text-[10px] opacity-50">Complete the form below to save changes</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Section 1: Classification */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4 flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full"></div> Classification</h2>
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
                      <label className={theme.label}>Sub-Category</label>
                      <select 
                        className={theme.input} 
                        value={formData.subCategory} 
                        onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                        disabled={!formData.category}
                      >
                        <option value="">Select Sub-Category</option>
                        {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Basic Details */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4 flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full"></div> Basic Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <label className={theme.label}>Product Name *</label>
                      <input 
                        type="text" 
                        className={theme.input} 
                        value={formData.name} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({...formData, name: val, slug: generateSlug(val)});
                        }} 
                        required 
                      />
                    </div>
                    <div>
                      <label className={theme.label}>Slug</label>
                      <input type="text" className={`${theme.input} opacity-50 cursor-not-allowed`} value={formData.slug} readOnly />
                    </div>
                    <div>
                      <label className={theme.label}>MRP (Base Price)</label>
                      <input type="number" className={theme.input} value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: e.target.value})} />
                    </div>
                    <div>
                      <label className={theme.label}>Selling Price *</label>
                      <input type="number" className={theme.input} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="md:col-span-2">
                      <label className={theme.label}>Short Summary</label>
                      <textarea className={`${theme.input} h-16 resize-none`} value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Rich Description */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4 flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full"></div> Detailed Content</h2>
                  <div className={`rounded-xl border p-2 bg-white ${isDarkMode ? 'border-gray-800 bg-[#1c2435]' : 'border-gray-200'}`}>
                    <div style={{ width: '100%', minHeight: '200px' }}>
                      <div ref={quillRef} />
                    </div>
                  </div>
                </div>

                {/* Section 4: Media */}
                <div className={`${theme.section} ${theme.card}`}>
                  <h2 className="text-xs font-bold mb-4 flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full"></div> Media Gallery</h2>
                  <div className="flex flex-wrap gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative w-24 h-24 border border-gray-700 rounded-xl overflow-hidden group shadow-lg">
                        <img src={img instanceof File ? URL.createObjectURL(img) : img} className="w-full h-full object-cover" alt="preview" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 flex items-center justify-center bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={20} className="text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-500/30 rounded-xl cursor-pointer hover:border-blue-600/50 hover:bg-blue-600/5 transition-all group">
                      <Upload size={20} className="opacity-30 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                      <span className="text-[9px] mt-2 font-bold opacity-30 group-hover:opacity-100">UPLOAD</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-gray-700 rounded-xl text-sm font-bold hover:bg-white/5 transition-all"
                   >
                    Cancel
                   </button>
                   <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                   >
                    {formData.id ? "Save Changes" : "Create Product"}
                   </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductCategory;