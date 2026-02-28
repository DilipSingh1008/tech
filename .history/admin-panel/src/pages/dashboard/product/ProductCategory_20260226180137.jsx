import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";
import { getItems, deleteItem, patchItem } from "../../../services/api";
import Searchbar from "../../../components/Searchbar";
import { useNavigate } from "react-router-dom";

const ProductCategory = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

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
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetchData();
  }, [page, sortBy, order, searchQuery]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
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
      {/* <header
        className={`px-6 py-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h1 className="text-sm font-bold">Product Catalog Management</h1>
        <p className="text-[10px] opacity-50">
          Manage your categories and product details
        </p>
      </header> */}

      <main className="flex-1 overflow-y-auto">
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
              onClick={() => navigate("/dashboard/products/add")}
              className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Table */}
          <div className={`${theme.card} rounded-xl overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-16">ID</th>
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
                    <th className="px-4 py-3 text-right w-24">Action</th>
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
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              prod.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                prod.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Edit → navigate to ProductForm with id */}
                            <button
                              onClick={() =>
                                navigate(`/dashboard/products/edit/${prod._id}`)
                              }
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
                  className="p-1.5 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] rounded-md border transition-all cursor-pointer ${
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
                  className="p-1.5 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductCategory;
