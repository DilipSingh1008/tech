import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  useGetItemsQuery,
  useGetItemByIdQuery,
} from "../../../redux/api/apiSlice";
import CommonImage from "../../../components/CommonImage";

const MediaAddEditPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } =
    useGetItemsQuery("media-category");
  const categoriesList = Array.isArray(categories?.data) ? categories.data : [];

  const { data: itemData, isLoading: itemLoading } = useGetItemByIdQuery(
    { url: `media-items/${id}` },
    { skip: !isEdit },
  );

  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();

  const initialValues = {
    title: "",
    url: "",
    link: "",
    category: "",
    type: "image",
    icon: null,
    existingIcon: null,
  };

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border border-gray-800 text-white"
      : "bg-white border border-gray-200 text-gray-700",
    input:
      "w-full p-2 text-sm rounded-lg border outline-none focus:ring-1 focus:ring-(--primary)",
    select:
      "w-full p-2 text-sm rounded-lg border outline-none focus:ring-1 focus:ring-(--primary)",
    fileInput:
      "w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-(--primary) file:text-white cursor-pointer",
    label: "block text-[10px] font-bold opacity-70 mb-1 uppercase",
    section: "p-4 md:p-6 rounded-xl border shadow-sm",
  };

  // Set initial form values if editing
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (itemData) {
      setFormValues({
        title: itemData.title || "",
        url: itemData.url || "",
        link: itemData.link || "",
        category: itemData.category || "",
        type: itemData.type || "image",
        icon: null,
        existingIcon: itemData.icon
          ? `http://localhost:5000${itemData.icon}`
          : null,
      });
    }
  }, [itemData]);

  // Validation schema
  const MediaSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    category: Yup.string().required("Category is required"),
    link: Yup.string()
      .trim()
      .test(
        "is-valid-video-link",
        "Enter a valid YouTube, Facebook, or Instagram link",
        (value) => {
          if (!value) return true;

          const ytRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)[\w-]+(&.*)?$/;
          const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.*$/;
          const igPostRegex =
            /^(https?:\/\/)?(www\.)?instagram\.com\/p\/[\w-]+\/?.*$/;
          const igReelRegex =
            /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[\w-]+\/?.*$/;

          return (
            ytRegex.test(value) ||
            fbRegex.test(value) ||
            igPostRegex.test(value) ||
            igReelRegex.test(value)
          );
        },
      )
      .nullable()
      .notRequired(),
  });

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = new FormData();
      payload.append("title", values.title);
      payload.append("url", values.url || "");
      payload.append("link", values.link || "");
      payload.append("category", values.category);
      payload.append("type", values.type);
      payload.append("folder", "media-items");

      if (!isEdit || values.icon) {
        payload.append("icon", values.icon);
      }

      if (isEdit) {
        await updateItem({ url: `media-items/${id}`, data: payload });
        alert("Media updated successfully!");
      } else {
        await createItem({ url: "media-items", data: payload });
        alert("Media created successfully!");
      }
      navigate("/dashboard/Manage-media-items");
    } catch (err) {
      console.error(err);
      alert("Failed to save media item");
    } finally {
      setSubmitting(false);
    }
  };

  if (categoriesLoading || (isEdit && itemLoading))
    return (
      <div className="flex h-screen items-center justify-center text-xs">
        Loading...
      </div>
    );

  // -------------------------------
  // MediaPreview Component
  // -------------------------------
  const MediaPreview = ({ type, icon, link, title }) => {
    const getYouTubeVideoId = (url) => {
      if (!url) return null;
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const getFacebookEmbed = (url) =>
      url
        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=200`
        : null;

    const getInstagramEmbed = (url) => {
      if (!url) return null;
      const shortcode = url.split("/p/")[1]?.split("/")[0];
      return shortcode
        ? `https://www.instagram.com/p/${shortcode}/embed`
        : null;
    };

    if (type === "image" && icon) {
      return (
        <CommonImage
          src={icon.startsWith("http") ? icon : `http://localhost:5000${icon}`}
          alt={title}
          className="w-40 h-40 object-cover rounded-lg border"
        />
      );
    }

    if (type === "video") {
      if (link) {
        // YouTube
        const ytId = getYouTubeVideoId(link);
        if (ytId) {
          return (
            <iframe
              width="200"
              height="120"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg border"
            />
          );
        }

        // Instagram
        if (link.includes("instagram.com")) {
          const igEmbed = getInstagramEmbed(link);
          if (igEmbed) {
            return (
              <iframe
                src={igEmbed}
                width="200"
                height="120"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg border"
              />
            );
          }
        }

        // Facebook
        if (link.includes("facebook.com")) {
          const fbEmbed = getFacebookEmbed(link);
          return (
            <iframe
              src={fbEmbed}
              width="200"
              height="120"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="rounded-lg border"
            />
          );
        }
      }

      // Local video fallback
      if (icon) {
        return (
          <video
            src={
              icon.startsWith("http") ? icon : `http://localhost:5000${icon}`
            }
            controls
            className="w-40 h-40 object-cover rounded-lg border"
          />
        );
      }
    }

    return <span className="text-[10px] opacity-40">No media</span>;
  };

  // -------------------------------
  return (
    <div className={`min-h-screen w-full flex flex-col ${theme.main}`}>
      <header
        className={`px-6 py-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h1 className="text-sm font-bold">
          {isEdit ? "Edit Media" : "Add New Media"}
        </h1>
        <p className="text-[10px] opacity-50">
          Fill in all required details below
        </p>
      </header>

      <main className="flex-1 overflow-y-auto  md:p-8">
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={MediaSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="max-w-4xl mx-auto space-y-6">
              {/* Basic Info Section */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={theme.label}>Title *</label>
                    <Field
                      name="title"
                      type="text"
                      placeholder="Title"
                      className={theme.input}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>

                  <div>
                    <label className={theme.label}>Category *</label>
                    <Field name="category" as="select" className={theme.select}>
                      <option value="">Select Category</option>
                      {categoriesList.map((cat) => (
                        <option key={cat._id} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>

                  <div>
                    <label className={theme.label}>Type</label>
                    <Field
                      name="type"
                      as="select"
                      className={theme.select}
                      onChange={(e) => setFieldValue("type", e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </Field>
                  </div>

                  <div>
                    <label className={theme.label}>URL</label>
                    <Field name="url" type="text" className={theme.input} />
                    <ErrorMessage
                      name="url"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={theme.label}>Video Link</label>
                    <Field name="link" type="text" className={theme.input} />
                    <ErrorMessage
                      name="link"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload Section */}
              <div className={`${theme.section} ${theme.card}`}>
                <h2 className="text-xs font-bold mb-4">Media Upload</h2>

                <div className="flex flex-col items-center gap-4">
                  {/* Preview */}
                  {values.icon || values.existingIcon || values.link ? (
                    <div className="flex justify-center">
                      <MediaPreview
                        type={values.type}
                        icon={values.icon || values.existingIcon}
                        link={values.link}
                        title={values.title}
                      />
                    </div>
                  ) : null}

                  {/* File Input */}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className={theme.fileInput}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFieldValue("icon", file); // Set the Formik value
                      }
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer py-3 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Media"
                    : "Add Media"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default MediaAddEditPage;
