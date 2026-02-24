import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { getItems, createItem, updateItem, deleteItem } from "../../../services/api";
import Searchbar from "../../../components/Searchbar";

const generateSlug = (text) =>
  text?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

const ProductCategory = () => {
  const { isDarkMode } = useTheme();
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
    id: null, category: "", subCategory: "", name: "", slug: "",
    mrp: "", price: "", shortDescription: "", mainDescription: "", images: [],
  });

  // --- Main Description Fix: Update formData when Quill changes ---
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setFormData(prev => ({ ...prev, mainDescription: quill.root.innerHTML }));
      });
    }
  }, [quill]);

  useEffect(() => {
    fetchData();
    fetchInitialCategories();
  }, [searchQuery]);

  const fetchInitialCategories = async () => {
    try {
      const res = await getItems("categories");
      setCategories(res.data.filter((cat) => !cat.catid));
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    try {
      const res = await getItems(`products?search=${searchQuery}`);
      setProducts(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCategoryChange = async (categoryId) => {
    setFormData(prev => ({ ...prev, category: categoryId, subCategory: "" }));
    if (!categoryId) { setSubCategories([]); return; }
    try {
      const res = await getItems("categories");
      setSubCategories(res.data.filter((cat) => cat.catid === categoryId));
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (prod) => {
    setFormData({
      id: prod._id,
      category: prod.category?._id || "",
      subCategory: prod.subCategory?._id || "",
      name: prod.name,
      slug: prod.slug,
      mrp: prod.mrp,
      price: prod.price,
      shortDescription: prod.shortDescription,
      mainDescription: prod.mainDescription,
      images: [],
    });

    if (prod.category?._id) {
      const res = await getItems("categories");
      setSubCategories(res.data.filter((cat) => cat.catid === prod.category._id));
    }

    // --- Main Description Fix: Load content into Quill ---
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(prod.mainDescription || "");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "id") data.append(key, formData[key]);
    });
    
    // Final check for main description
    data.set("mainDescription", quill?.root.innerHTML || "");

    formData.images.forEach((file) => {
      if (file instanceof File) data.append("images", file);
    });

    try {
      if (formData.id) await updateItem(`products/${formData.id}`, data);
      else await createItem("products", data);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert("Error saving product"); }
  };

  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode ? "bg-[#151b28] border border-gray-800 text-white" : "bg-white border border-gray-200 text-gray-700",
    input: "w-full p-2 text-sm rounded border outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)/30 bg-transparent",
    label: "block text-[10px] font-bold opacity-70 mb-1 uppercase",
    section: "p-4 md:p-6 rounded-xl border shadow-sm",
  };

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <header className={`px-6 py-4 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <h1 className="text-sm font-bold">Product Management</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between mb-6">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
            <button
              onClick={() => {
                setFormData({ id: null, category: "", subCategory: "", name: "", slug: "", mrp: "", price: "", shortDescription: "", mainDescription: "", images: [] });
                if (quill) quill.setText(''); 
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-lg text-xs font-bold"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Table (Simplified for brevity) */}
          <div className={`${theme.card} rounded-xl overflow-hidden`}>
            <table className="w-full text-left text-xs">
              <thead className={isDarkMode ? "bg-[#1f2637]" : "bg-gray-100"}>
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} className="border-b border-gray-800/50">
                    <td className="px-6 py-4">{prod.name}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleEdit(prod)} className="p-1.5 hover:text-(--primary)"><Edit3 size={15} /></button>
                      <button onClick={() => deleteItem(`products/${prod._id}`).then(fetchData)} className="p-1.5 hover:text-red-500"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`${theme.card} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase">Product Details</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Basic Info (Category Selects) */}
                <div className={theme.section}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={theme.label}>Category</label>
                      <select className={theme.input} value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)} required>
                        <option value="">Select</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={theme.label}>Sub-Category</label>
                      <select className={theme.input} value={formData.subCategory} onChange={(e) => setFormData({...formData, subCategory: e.target.value})} disabled={!formData.category}>
                        <option value="">Select</option>
                        {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Main Description Fix: Reference assigned here */}
                <div className={theme.section}>
                  <label className={theme.label}>Main Description</label>
                  <div className="rounded-xl border p-2 bg-white text-black">
                    <div ref={quillRef} style={{ minHeight: '200px' }} />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-(--primary) text-white rounded-lg font-bold">
                  {formData.id ? "Update Product" : "Save Product"}
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