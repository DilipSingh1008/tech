import { useRef, useState } from "react";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";

const initialCategories = [
  {
    id: 1,
    name: "Electronics",
    subCategories: [
      { id: 11, name: "Mobiles" },
      { id: 12, name: "Laptops" },
    ],
  },
  {
    id: 2,
    name: "Fashion",
    subCategories: [
      { id: 21, name: "Men" },
      { id: 22, name: "Women" },
    ],
  },
];

const ManageCategories = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");
  const idCounter = useRef(3);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const addCategory = () => {
    const newCat = {
      id: idCounter.current++,
      name: "New Category",
      subCategories: [],
    };
    console.log(newCat);
    setCategories([...categories, newCat]);
    setEditingId(newCat.id);
    setTempName("New Category");
  };

  const handleSave = (id, isSub = false, parentId = null) => {
    if (!tempName.trim()) {
      setEditingId(null);
      return;
    }
    const updated = categories.map((cat) => {
      if (!isSub && cat.id === id) return { ...cat, name: tempName };
      if (isSub && cat.id === parentId) {
        return {
          ...cat,
          subCategories: cat.subCategories.map((sub) =>
            sub.id === id ? { ...sub, name: tempName } : sub,
          ),
        };
      }
      return cat;
    });
    setCategories(updated);
    setEditingId(null);
  };

  const deleteCategory = (id) =>
    setCategories(categories.filter((cat) => cat.id !== id));

  const addSubCategory = (parentId) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => {
        if (cat.id === parentId) {
          const nextId =
            cat.subCategories.length > 0
              ? Math.max(...cat.subCategories.map((s) => s.id)) + 1
              : 1;

          const newSub = {
            id: nextId,
            name: "New Sub",
          };

          return {
            ...cat,
            subCategories: [...cat.subCategories, newSub],
          };
        }
        return cat;
      }),
    );
  };

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-200"
      : "bg-gray-50 text-gray-800",
    card: isDarkMode
      ? "bg-[#151b28] border-gray-800"
      : "bg-white border-gray-200",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-600",
    input: isDarkMode
      ? "bg-[#1c2333] border-indigo-500 text-white"
      : "bg-white border-indigo-400",
    pill: isDarkMode
      ? "bg-[#1e2536] border-gray-700 text-gray-300"
      : "bg-gray-100 border-gray-300 text-gray-700",
    rowHover: isDarkMode ? "hover:bg-[#1c2333]" : "hover:bg-gray-50",
  };

  return (
    <div className={`flex h-screen overflow-hidden text-sm ${theme.main}`}>
      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}

      <div className="flex-1 flex flex-col min-w-0">
        {/* <Navbar onMenuClick={toggleSidebar} /> */}

        <main className="p-3 md:p-5 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Categories</h2>
                <p className="text-xs opacity-60">
                  Manage your product hierarchy
                </p>
              </div>
              <button
                onClick={addCategory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all text-xs font-medium shadow-sm"
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            {/* Table Container */}
            <div
              className={`rounded-lg border shadow-sm overflow-hidden ${theme.card}`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead
                    className={`text-[11px] uppercase tracking-wider font-semibold ${theme.header}`}
                  >
                    <tr>
                      <th className="px-4 py-2.5">ID</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Sub Categories</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/10 dark:divide-gray-100/10">
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className={`transition-colors group ${theme.rowHover}`}
                      >
                        {/* ID Cell */}
                        <td
                          className={`px-4 py-3 whitespace-nowrap ${theme.text}`}
                        >
                          {cat.id}
                        </td>

                        {/* Main Category Cell */}
                        <td
                          className={`px-4 py-3 whitespace-nowrap ${theme.text}`}
                        >
                          {editingId === cat.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                className={`border rounded px-2 py-0.5 text-sm outline-none w-32 ${theme.input}`}
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleSave(cat.id)
                                }
                              />
                              <button
                                onClick={() => handleSave(cat.id)}
                                className="text-green-500 p-1"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="font-medium">{cat.name}</span>
                          )}
                        </td>

                        {/* Sub Categories Cell */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {cat.subCategories.map((sub) => (
                              <div
                                key={sub.id}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs ${theme.pill}`}
                              >
                                {editingId === sub.id ? (
                                  <input
                                    className="bg-transparent outline-none w-16"
                                    value={tempName}
                                    onChange={(e) =>
                                      setTempName(e.target.value)
                                    }
                                    onBlur={() =>
                                      handleSave(sub.id, true, cat.id)
                                    }
                                    autoFocus
                                  />
                                ) : (
                                  <span className={`${theme.text}`}>
                                    {sub.id}. {sub.name}
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingId(sub.id);
                                    setTempName(sub.name);
                                  }}
                                  className="text-gray-400 hover:text-indigo-500 transition-colors"
                                >
                                  <Edit3 size={10} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addSubCategory(cat.id)}
                              className="text-[11px] text-indigo-500 hover:underline flex items-center gap-0.5 ml-1"
                            >
                              <Plus size={10} /> Add
                            </button>
                          </div>
                        </td>

                        {/* Actions Cell */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingId(cat.id);
                                setTempName(cat.name);
                              }}
                              className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 rounded"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => deleteCategory(cat.id)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categories.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-xs">
                  No categories found. Click "Add New" to begin.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageCategories;
