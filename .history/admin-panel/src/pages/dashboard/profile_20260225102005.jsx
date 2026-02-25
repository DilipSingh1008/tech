import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { User, Camera, Save, ShieldCheck } from "lucide-react";
import * as Yup from "yup";

import { getItems, updateItem } from "../../services/api";

const profileSchema = Yup.object({
  fullName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid").required("Required"),
  phone: Yup.string().required("Required"),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string().min(6).required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Required"),
});

const ProfilePage = () => {
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Admin",
    photo: "",
  });

  const [preview, setPreview] = useState("");

  // ⭐ load profile
  useEffect(() => {
    getItems("admin/profile").then((res) => {
      setInitialValues(res);
      setPreview(res.photo);
    });
  }, []);

  return (
    <div className="p-10 space-y-10">

      {/* ================= PROFILE ================= */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = new FormData();

          Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
          });

          await updateItem("admin/profile", formData);
          setSubmitting(false);
          alert("Profile updated");
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="bg-white p-8 rounded-xl space-y-6">

            {/* image */}
            <div className="relative w-24">
              <img
                src={preview || "/avatar.png"}
                className="w-24 h-24 rounded-full object-cover"
              />

              <label className="absolute bottom-0 right-0 cursor-pointer">
                <Camera size={16} />
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    setFieldValue("photo", e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>
            </div>

            {/* fields */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Field name="fullName" className="input" />
                <ErrorMessage name="fullName" component="p" className="error"/>
              </div>

              <Field name="role" readOnly className="input bg-gray-100"/>

              <div>
                <Field name="email" className="input" />
                <ErrorMessage name="email" component="p" className="error"/>
              </div>

              <div>
                <Field name="phone" className="input" />
                <ErrorMessage name="phone" component="p" className="error"/>
              </div>
            </div>

            <button disabled={isSubmitting} className="btn-primary">
              <Save size={16}/> Save Changes
            </button>

          </Form>
        )}
      </Formik>

      {/* ================= PASSWORD ================= */}
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordSchema}
        onSubmit={async (values, { resetForm }) => {
          await updateItem("admin/change-password", values);
          resetForm();
          alert("Password updated");
        }}
      >
        {() => (
          <Form className="bg-white p-8 rounded-xl space-y-6">

            <div className="grid grid-cols-3 gap-5">
              <div>
                <Field name="currentPassword" type="password" className="input"/>
                <ErrorMessage name="currentPassword" component="p" className="error"/>
              </div>

              <div>
                <Field name="newPassword" type="password" className="input"/>
                <ErrorMessage name="newPassword" component="p" className="error"/>
              </div>

              <div>
                <Field name="confirmPassword" type="password" className="input"/>
                <ErrorMessage name="confirmPassword" component="p" className="error"/>
              </div>
            </div>

            <button className="btn-primary flex gap-2 items-center">
              <ShieldCheck size={16}/> Update Security
            </button>

          </Form>
        )}
      </Formik>

    </div>
  );
};

export default ProfilePage;