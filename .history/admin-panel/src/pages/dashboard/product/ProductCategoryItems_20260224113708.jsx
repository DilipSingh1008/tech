import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Image as ImageIcon, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../../services/api";

const ProductItem = () => {
  const { isDarkMode } = useTheme();

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    images: [],
    id: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getItems("product-item");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("folder", "products");

    formData.images.forEach((img) => data.append("images", img));

    try {
      if (formData.id) {
        await updateItem(`product-item/${formData.id}`, data);
      } else {
        await createItem("product-item", data);
      }

      setIsModalOpen(false);
      setFormData({ name: "", price: "", category: "", images: [], id: null });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete product?")) {
      await deleteItem(`product-item/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const handleToggleStatus = async (id) => {
    await updateItem(`product-item/status/${id}`, {});
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: !p.status } : p))
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-3 py-2 rounded"
      >
        <Plus size={14} /> Add Product
      </button>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {products.map((p) => (
          <div key={p._id} className="border p-3 rounded">
            {p.images?.length ? (
              <img
                src={`http://localhost:5000/uploads/${p.images[0]}`}
                className="h-32 w-full object-cover"
                alt=""
              />
            ) : (
              <ImageIcon />
            )}

            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            <div className="flex gap-2 mt-2">
              <Edit3
                size={14}
                className="cursor-pointer"
                onClick={() => {
                  setFormData({ ...p, id: p._id });
                  setIsModalOpen(true);
                }}
              />

              <Trash2
                size={14}
                className="cursor-pointer"
                onClick={() => handleDelete(p._id)}
              />

              <button onClick={() => handleToggleStatus(p._id)}>
                {p.status ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleSave}
            className="bg-white p-4 rounded-lg w-80 space-y-2"
          >
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="border p-2 w-full"
            />

            <input
              type="file"
              multiple
              onChange={(e) =>
                setFormData({ ...formData, images: [...e.target.files] })
              }
            />

            <button className="bg-blue-500 text-white p-2 w-full rounded">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductItem;