import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGetDataQuery } from '../../redux/api/apiSlice';

const Location = () => {
  const { data, isLoading, error } = useGetDataQuery({
  url: "/countrylocation",
});


  // Dummy Data
  const [countries, setCountries] = useState([
    { id: 1, name: 'India' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'Germany' },
  ]);

  const [editingCountry, setEditingCountry] = useState(null);

  // Form Validation Schema (Yup)
  const validationSchema = Yup.object({
    countryName: Yup.string()
      .min(2, 'Bahut chhota naam hai!')
      .max(50, 'Bahut bada naam hai!')
      .required('Country ka naam zaroori hai'),
  });

  // Handlers
  const handleAddOrUpdate = (values, { resetForm }) => {
    if (editingCountry) {
      // Rename logic
      setCountries(countries.map(c => 
        c.id === editingCountry.id ? { ...c, name: values.countryName } : c
      ));
      setEditingCountry(null);
    } else {
      // Create logic
      const newCountry = {
        id: Date.now(),
        name: values.countryName,
      };
      setCountries([...countries, newCountry]);
    }
    resetForm();
  };

  const deleteCountry = (id) => {
    setCountries(countries.filter(c => c.id !== id));
  };

  const startEdit = (country) => {
    setEditingCountry(country);
  };

  if(isLoading) return <div>Loading...</div>;

console.log(data)

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Location Management</h1>

      {/* Formik Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
        <Formik
          initialValues={{ countryName: editingCountry ? editingCountry.name : '' }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleAddOrUpdate}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Field
                  name="countryName"
                  placeholder="Enter Country Name"
                  className={`p-2 rounded bg-gray-700 border ${
                    errors.countryName && touched.countryName ? 'border-red-500' : 'border-gray-600'
                  } outline-none`}
                />
                <ErrorMessage name="countryName" component="span" className="text-red-400 text-sm mt-1" />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                {editingCountry ? 'Rename Country' : 'Create Country'}
              </button>
              
              {editingCountry && (
                <button 
                  type="button" 
                  onClick={() => setEditingCountry(null)}
                  className="text-gray-400 cursor-pointer hover:text-white text-sm"
                >
                  Cancel Edit
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>

      {/* Country Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Country Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-4">{country.id}</td>
                <td className="p-4 font-medium">{country.name}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() => startEdit(country)}
                    className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm"
                  >
                    Edit/Rename
                  </button>
                  <button
                    onClick={() => deleteCountry(country.id)}
                    className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Location;