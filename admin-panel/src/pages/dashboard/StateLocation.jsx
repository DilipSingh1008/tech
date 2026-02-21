import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useDeleteDataMutation,
  useGetDataQuery,
  usePostDataMutation,
  useUpdateDataMutation,
} from "../../redux/api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPlusCircle,
  FiXCircle,
} from "react-icons/fi"; // Added icons

const StateLocation = () => {
    const {id} = useParams()
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetDataQuery({
    url: `/statelocation/${id}`,
  });
  const [postData, { isLoading: createLoading }] = usePostDataMutation();
  const [updateData, { isLoading: updateLoading }] = useUpdateDataMutation();
  const [deleteData, { isLoading: deleteLoading }] = useDeleteDataMutation();
  const [editingCountry, setEditingCountry] = useState(null);

  const validationSchema = Yup.object({
    countryName: Yup.string()
      .min(2, "Name too short!")
      .max(50, "Name too long!")
      .required("Required"),
  });

  const submitCountryFunction = async (values, { resetForm }) => {
    try {
      if (editingCountry) {
        await updateData({
          url: `/countrylocation/${editingCountry._id}/edit-country`,
          body: { country: values.countryName },
        }).unwrap();
        setEditingCountry(null);
      } else {
        await postData({
          url: "/countrylocation",
          body: { country: values.countryName },
        }).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (!confirmDelete) return;

      await deleteData({
        url: `/countrylocation/${id}/delete-country`,
      }).unwrap();

      // agar edit mode me same item delete ho gaya
      if (editingCountry?._id === id) {
        setEditingCountry(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10 text-white">Loading...</div>
    );
  if (error)
    return (
      <div className="text-red-500 p-10 text-center">Error loading data.</div>
    );

  const statesData = data || [];

  return (
    <div className="p-4 md:p-8 bg-[#0f172a] min-h-screen text-slate-200 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <FiMapPin className="text-blue-500 text-3xl" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            State <span className="text-blue-500">Management</span>
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-10 backdrop-blur-sm shadow-xl">
          <h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold mb-4">
            {editingCountry ? "Edit Country Details" : "Add New Country"}
          </h2>

          <Formik
            initialValues={{
              countryName: editingCountry ? editingCountry.name : "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={submitCountryFunction}
          >
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-2">
                  <Field
                    name="countryName"
                    placeholder="e.g. India"
                    className={`w-full p-3 rounded-xl bg-slate-900 border ${
                      errors.countryName && touched.countryName
                        ? "border-red-500"
                        : "border-slate-600"
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                  />
                  <ErrorMessage
                    name="countryName"
                    component="span"
                    className="text-red-400 text-xs mt-1 ml-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLoading || updateLoading}
                  className="flex cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {editingCountry ? <FiEdit2 /> : <FiPlusCircle />}
                  {editingCountry
                    ? updateLoading
                      ? "Updating..."
                      : "Update"
                    : createLoading
                      ? "Creating..."
                      : "Add Country"}
                </button>

                {editingCountry && (
                  <button
                    type="button"
                    onClick={() => setEditingCountry(null)}
                    className="flex items-center justify-center cursor-pointer gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-xl transition-all"
                  >
                    <FiXCircle /> Cancel
                  </button>
                )}
              </Form>
            )}
          </Formik>
        </div>

        {/* Table Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-700/50 text-slate-300 uppercase text-xs letter tracking-wider">
                <th className="p-5 font-bold"># ID</th>
                <th className="p-5 font-bold">Country Name</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {statesData.map((country, index) => (
                <tr
                  key={country._id}
                  className="hover:bg-slate-700/30 transition-colors group"
                >
                  <td className="p-5 text-slate-500 font-mono text-sm">
                    {index + 1}
                  </td>
                  <td
                    className="p-5 font-medium text-slate-200 group-hover:text-blue-400 cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(`/dashboard/location/${country._id}`)
                    }
                  >
                    {country.name}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCountry(country)}
                        className="p-2 cursor-pointer hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(country._id)}
                        disabled={deleteLoading}
                        className="p-2 cursor-pointer hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {statesData.length === 0 && (
            <div className="p-10 text-center text-slate-500 italic">
              No locations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateLocation;
