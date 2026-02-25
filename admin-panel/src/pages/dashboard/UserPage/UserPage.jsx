import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2, Edit3, X, ImageIcon } from "lucide-react";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../../services/api";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Searchbar from "../../../components/Searchbar";

// Image validation
// const validateImageDimensions = (file) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       const { width, height } = img;
//       if (width >= 200 && width <= 500 && height >= 200 && height <= 500) {
//         resolve(true);
//       } else {
//         reject("Image must be between 200x200 px and 500x500 px");
//       }
//     };

//     img.onerror = () => reject("Invalid image file");
//   });
// };

const UserPage = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [roles, setRoles] = useState([]);
  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border-gray-800"
      : "bg-white border-gray-200",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-500",
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
  };

  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {
    try {
      const res = await getItems("role?limit=100");
      console.log(res);
      setRoles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log(searchQuery);
      const res = await getItems(
        `user?page=${page}&limit=${limit}&search=${searchQuery}`,
      );
      console.log(res);
      setUsers(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteItem(`user/${id}`);
      fetchUsers();
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    await updateItem(`user/${id}`, {
      status: !currentStatus,
    });

    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, status: !currentStatus } : user,
      ),
    );
  };

  const UserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .when("isEdit", {
        is: false,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    role: Yup.string().required("Role is required"),
    image: Yup.mixed().when("isEdit", {
      is: false,
      then: (schema) => schema.required("Image is required"),
      otherwise: (schema) => schema,
    }),
  });

  //   if (loading)
  //     return (
  //       <div className="flex h-screen items-center justify-center text-xs font-medium">
  //         Loading...
  //       </div>
  //     );
  console.log(users);
  return (
    <div className={`h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex cursor-pointer items-center justify-between mb-4">
            <Searchbar
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-(--primary) text-white rounded-lg text-xs font-semibold hover:bg-(--primary) transition-all"
            >
              <Plus size={14} /> Add User
            </button>
          </div>

          <div
            className={`rounded-xl border shadow-sm overflow-hidden ${theme.card}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-20">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 w-24">Role</th>
                    <th className="px-4 py-3 w-24">Photo</th>
                    <th className="px-4 py-3 w-24">Status</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <div className="flex h-screen items-center justify-center text-xs font-medium">
                      Loading...
                    </div>
                  ) : (
                    users.map((u, index) => (
                      <tr
                        key={u._id}
                        className="hover:bg-indigo-500/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-semibold">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-sm">
                          {u.name}
                        </td>
                        <td className="px-4 py-2.5 text-sm">{u.email}</td>
                        <td className="px-4 py-2.5 text-sm capitalize">
                          {u.role?.name || u.role}{" "}
                        </td>

                        <td className="px-4 py-2.5">
                          <div className="w-8 h-8 rounded bg-gray-500/10 border border-gray-500/10 overflow-hidden flex items-center justify-center">
                            {u.image ? (
                              <img
                                src={`http://localhost:5000/${u.image}`}
                                className="w-full h-full object-cover"
                                alt="user"
                              />
                            ) : (
                              <ImageIcon size={14} className="opacity-30" />
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(u._id, u.status)}
                            className={`cursor-pointer w-8 h-4 rounded-full relative transition-colors ${
                              u.status ? "bg-(--primary)" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`cursor-pointer absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                u.status ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-2.5 text-right flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 cursor-pointer hover:text-(--primary)"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-1.5 cursor-pointer hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
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
                Showing {users.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 cursor-pointer border rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 cursor-pointer text-[11px] rounded-md border transition-all ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary) shadow-sm"
                        : "hover:border-(--primary) hover:text-(--primary) border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border cursor-pointer rounded-md disabled:opacity-30 hover:border-(--primary) hover:text-(--primary)"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
              <div
                className={`${
                  isDarkMode ? "bg-[#151b28] text-white" : "bg-white"
                } p-5 rounded-xl w-full max-w-xs shadow-xl border border-gray-700/30`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">
                    {editingUser ? "Edit User" : "New User"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="opacity-50 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    name: editingUser?.name || "",
                    email: editingUser?.email || "",
                    password: "",
                    role: editingUser?.role?._id || "",
                    image: null,
                    isEdit: !!editingUser,
                  }}
                  validationSchema={UserSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const formData = new FormData();
                      formData.append("name", values.name);
                      formData.append("email", values.email);
                      formData.append("roleId", values.role);
                      formData.append("folder", "User");

                      if (!editingUser) {
                        formData.append("password", values.password);
                      }

                      if (values.image) formData.append("image", values.image);

                      if (editingUser) {
                        await updateItem(`user/${editingUser._id}`, formData);
                      } else {
                        await createItem("user", formData);
                      }

                      setIsModalOpen(false);
                      fetchUsers();
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ setFieldValue, setFieldError, values }) => (
                    <Form className="space-y-3">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Name <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Email <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-[10px] mt-1"
                        />
                      </div>

                      {/* Password (only for create) */}
                      {!editingUser && (
                        <div>
                          <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                            Password{" "}
                            <span className="text-red-500 text-sm">*</span>
                          </label>
                          <Field
                            type="password"
                            name="password"
                            className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-[10px]"
                          />
                        </div>
                      )}

                      {/* Role */}
                      {/* <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Role
                        </label>
                        <Field
                          as="select"
                          name="role"
                          className="w-full p-2 text-sm rounded-lg bg-gray-500/5 border border-gray-500/20 outline-none focus:border-(--primary)"
                        >
                          <option value="user">User</option>
                          <option value="sub-admin">Sub-Admin</option>
                        </Field>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div> */}
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          Role
                        </label>

                        <Field
                          as="select"
                          name="role"
                          className="w-full p-2 text-sm rounded-lg 
bg-[var(--card-bg)] 
text-[var(--text-main)]
border border-[var(--border-color)]
outline-none 
focus:border-[var(--primary)]
appearance-none"
                        >
                          <option value="">Select Role</option>

                          {roles
                            .filter((r) => r.status === true)
                            .map((role) => (
                              <option key={role._id} value={role._id}>
                                {role.name.charAt(0).toUpperCase() +
                                  role.name.slice(1)}
                              </option>
                            ))}
                        </Field>

                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold opacity-50 uppercase mb-1">
                          User Image (200x200 px){" "}
                          <span className="text-red-500 text-sm">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.currentTarget.files[0];
                            if (file) {
                              try {
                                // await validateImageDimensions(file);
                                setFieldValue("image", file);
                              } catch (err) {
                                setFieldError("image", err);
                              }
                            }
                          }}
                          className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-(--primary) file:text-white hover:file:bg-(--primary) cursor-pointer"
                        />
                        {values.image && (
                          <img
                            src={
                              values.image instanceof File
                                ? URL.createObjectURL(values.image)
                                : values.image
                            }
                            alt="user"
                            className="w-16 h-16 object-cover rounded mt-2"
                          />
                        )}
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-red-500 text-[10px]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 mt-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:bg-(--primary) transition-all"
                      >
                        {editingUser ? "Update User" : "Create User"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserPage;
