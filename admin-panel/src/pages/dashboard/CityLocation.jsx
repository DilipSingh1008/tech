import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetDataQuery,
  usePostDataMutation,
} from "../../redux/api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";

const CityLocation = () => {
  const navigate = useNavigate();

  const {id} = useParams()
  //  Fetch countries
  const { data, isLoading, error } = useGetDataQuery({
    url: `/statelocation/${id}/all-cities`,
  });

  //  Create country mutation
  const [postData, { isLoading: createLoading }] = usePostDataMutation();

  const [editingCountry, setEditingCountry] = useState(null);

  //  Validation
  const validationSchema = Yup.object({
    countryName: Yup.string()
      .min(2, "Bahut chhota naam hai!")
      .max(50, "Bahut bada naam hai!")
      .required("Country ka naam zaroori hai"),
  });

  // ⭐ Create country function
  const createCountryFunction = async (values, { resetForm }) => {
    try {
      await postData({
        url: "/countrylocation",
        body: { country: values.countryName },
      }).unwrap();

      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const countriesData = data || [];

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Location Management</h1>

      {/* ⭐ Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
        <Formik
          initialValues={{
            countryName: editingCountry ? editingCountry.name : "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={createCountryFunction}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Field
                  name="countryName"
                  placeholder="Enter Country Name"
                  className={`p-2 rounded bg-gray-700 border ${
                    errors.countryName && touched.countryName
                      ? "border-red-500"
                      : "border-gray-600"
                  } outline-none`}
                />
                <ErrorMessage
                  name="countryName"
                  component="span"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                {createLoading ? "Creating..." : "Create Country"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* ⭐ Table */}
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
            {countriesData.map((country, index) => (
              <tr
                key={country._id}
                className="border-b border-gray-700 hover:bg-gray-750"
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium hover:text-blue-400 cursor-pointer" >{country.name}</td>

                <td className="p-4 flex justify-center gap-3">
                  <button className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm">
                    Edit
                  </button>

                  <button className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
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

export default CityLocation;