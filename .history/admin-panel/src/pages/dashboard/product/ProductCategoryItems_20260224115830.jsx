import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  X,
  RefreshCcw,
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

const ProductCategoryItems = () => {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // To populate category dropdown
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    category: "",
    images: [],
  });

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchData();
    fetchCategories(); // Needed for the "Category" dropdown in the modal
  }, [page, sortBy, order, searchQuery]);

  const fetchData = async () => {
    try {
      const url = `product-item?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}`;
      const res = await getItems(url);
      setProducts(res.data || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getItems("product-category?limit=100");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await patchItem(`product-item/status/${id}`);
      setProducts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: !currentStatus } : item
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("salePrice", formData.salePrice);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("folder", "product-items");

    // Handle multiple images
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => {
        if (file instanceof File) data.append("images", file);
      });
    }

    try {
      if (formData.id) {
        await updateItem(`product-item/${formData.id}`, data);
      } else {
        await createItem("product-item", data);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteItem(`product-item/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      slug: "",
      description: "",
      price: "",
      salePrice: "",
      stock: "",
      category: "",
      images: [],
    });
  };

  const theme = {
    main: isDarkMode ? "bg-[#0b0e14] text-slate-300" : "bg-gray-50 text-gray-700",
    card: isDarkMode ? "bg-[#151b28] border-gray-800" : "bg-white border-gray-200",
    header: isDarkMode ? "bg-[#1f2637] text-gray-400" : "bg-gray-100 text-gray-500",
    input: isDarkMode ? "bg-gray-500/5 border-gray-500/20 text-white" : "bg-white border-gray-300 text-gray-900",
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xs">Loading...</div>;

  return (
    <div className={`h-screen w-full flex flex-col ${theme.main} p-4`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-4">
            <Searchbar onChange={(e) => setSearchQuery(e.target.value)} />
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>

          {/* Table */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`uppercase tracking-wider font-bold ${theme.header}`}>
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800 divide-gray-100">
                  {products.map((item) => (
                    <tr key={item._id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-500/10 overflow-hidden flex items-center justify-center border border-gray-500/10">
                            {item.images?.length > 0 ? (
                              <img src={`http://localhost:5000/uploads/${item.images[0]}`} className="object-cover w-full h-full" alt="" />
                            ) : (
                              <ImageIcon size={14} className="opacity-30" />
                            )}
                          </div>
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 opacity-70">{item.category?.name || "N/A"}</td>
                      <td className="px-4 py-2.5 font-bold text-green-600">${item.salePrice || item.price}</td>
                      <td className="px-4 py-2.5">{item.stock}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => handleToggleStatus(item._id, item.status)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${item.status ? "bg-(--primary)" : "bg-gray-400"}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${item.status ? "left-4.5" : "left-0.5"}`} />
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => { setFormData({ ...item, id: item._id }); setIsModalOpen(true); }} className="p-1.5 hover:text-(--primary)"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`flex items-center justify-between p-3 border-t dark:border-gray-800 border-gray-100`}>
                <span className="text-[11px] opacity-60">Showing {products.length} products</span>
                <div className="flex items-center gap-1">
                    <button disabled={page === 1} onClick={() => setPage(page-1)} className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary)"><FiChevronLeft size={16} /></button>
                    <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="p-1.5 border rounded-md disabled:opacity-30 hover:border-(--primary)"><FiChevronRight size={16} /></button>
                </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className={`${theme.card} p-6 rounded-xl w-full max-w-lg shadow-2xl border`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">{formData.id ? "Edit Product" : "New Product"}</h3>
                  <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                </div>
                <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase opacity-50">Product Name</label>
                    <input type="text" required className={`w-full p-2 text-sm rounded-lg outline-none border ${theme.input}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-50">Price</label>
                    <input type="number" required className={`w-full p-2 text-sm rounded-lg outline-none border ${theme.input}`} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-50">Stock</label>
                    <input type="number" required className={`w-full p-2 text-sm rounded-lg outline-none border ${theme.input}`} value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase opacity-50">Category</label>
                    <select required className={`w-full p-2 text-sm rounded-lg outline-none border ${theme.input}`} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase opacity-50">Images</label>
                    <input type="file" multiple accept="image/*" className="w-full text-xs" onChange={(e) => setFormData({ ...formData, images: e.target.files })} />
                  </div>
                  <button type="submit" className="col-span-2 py-2.5 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90">
                    {formData.id ? "Update Product" : "Create Product"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductCategoryItems;