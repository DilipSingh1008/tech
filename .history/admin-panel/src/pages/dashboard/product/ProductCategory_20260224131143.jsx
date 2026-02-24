import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  X,
  RefreshCcw,
  Search,
  Upload,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  patchItem,
} from "../../../services/api";
import Searchbar from "../../../components/Searchbar";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const ProductCategory = () => {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced Form Data State
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
    images: [], // Multiple files
  });

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, [page, sortBy, order, searchQuery]);

  const fetchDropdowns = async () => {
    try {
      const catRes = await getItems("product-category?limit=100");
      setCategories(catRes.data || []);
      // Optional: Fetch sub-categories based on selection or all
    } catch (err) {
      console.error("Error fetching dropdowns", err);
    }
  };

  const fetchData = async () => {
    try {
      let url = `products?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`;
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
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "id") {
        data.append(key, formData[key]);
      }
    });

    // Append multiple images
    formData.images.forEach((file) => {
      if (file instanceof File) {
        data.append("images", file);
      }
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
  };

  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode ? "bg-[#151b28] border-gray-800" : "bg-white border-gray-200",
    header: isDarkMode ? "bg-[#1f2637] text-gray-400" : "bg-gray-100 text-gray-500",
    input: isDarkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900",
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Table view remains similar, adjust columns for Product Name, Category, Price */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase font-bold ${theme.header}`}>
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-blue-500/5">
                    <td className="px-4 py-3 font-medium">{prod.name}</td>
                    <td className="px-4 py-3">{prod.category?.name || "N/A"}</td>
                    <td className="px-4 py-3">₹{prod.price}</td>
                    <td className="px-4 py-3 text-right">
                       <button onClick={() => { setFormData({...prod, id: prod._id, images: []}); setIsModalOpen(true); }} className="p-1.5 hover:text-blue-500"><Edit3 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Product Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className={`${theme.card} p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">{formData.id ? "Edit Product" : "New Product"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="opacity-50 hover:opacity-100"><X size={20} /></button>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category & Sub Category */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Category</label>
                    <select 
                      className={`w-full p-2 rounded-lg border outline-none ${theme.input}`}
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Sub-Category</label>
                    <input 
                      type="text"
                      className={`w-full p-2 rounded-lg border outline-none ${theme.input}`}
                      value={formData.subCategory}
                      onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                    />
                  </div>

                  {/* Name & Slug */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Product Name</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 rounded-lg border outline-none ${theme.input}`}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Slug</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 rounded-lg border outline-none ${theme.input}`}
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">MRP</label>
                    <input 
                      type="number" 
                      className={`w-full p-2 rounded-lg border outline-none ${theme.input}`}
                      value={formData.mrp}
                      onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Sale Price</label>
                    <input 
                      type="number" 
                      className={`w-full p-2 rounded-lg border outline-none ${theme.input}`}
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase mb-1">Short Description</label>
                    <textarea 
                      className={`w-full p-2 rounded-lg border outline-none h-20 ${theme.input}`}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    />
                  </div>

                  {/* React Quill - Main Description */}
                  <div className="md:col-span-2 mb-12">
                    <label className="block text-[10px] font-bold uppercase mb-1">Main Description</label>
                    <div className="bg-white text-black rounded-lg">
                      <ReactQuill 
                        theme="snow"
                        value={formData.mainDescription}
                        onChange={(content) => setFormData({...formData, mainDescription: content})}
                        className="h-48"
                      />
                    </div>
                  </div>

                  {/* Multiple Photo Upload */}
                  <div className="md:col-span-2 mt-4">
                    <label className="block text-[10px] font-bold uppercase mb-2">Product Images</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden group">
                          <img 
                            src={img instanceof File ? URL.createObjectURL(img) : img} 
                            className="w-full h-full object-cover" 
                            alt="preview"
                          />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-500/30 rounded-lg cursor-pointer hover:bg-blue-500/5 transition-colors">
                        <Upload size={16} className="opacity-50" />
                        <span className="text-[10px] mt-1 opacity-50">Upload</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg"
                    >
                      {formData.id ? "Update Product" : "Create Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductCategory;