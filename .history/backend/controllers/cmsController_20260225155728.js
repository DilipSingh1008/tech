const CMS = require("../models/cms.js");

// ⭐ custom slugify
const makeSlug = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
};

exports.createCMS = async (req, res) => {
  try {
    const {
      title,
      meta,
      metaDescription,
      shortDescription,
      slug,
      status,
      folder,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ⭐ slug generate
    const finalSlug = slug ? makeSlug(slug) : makeSlug(title);

    // ⭐ duplicate slug check
    const exists = await CMS.findOne({ slug: finalSlug });
    if (exists) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // ⭐ images save (dynamic folder multer)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/uploads/${folder || "default"}/${file.filename}`
      );
    }

    const cms = await CMS.create({
      title,
      meta,
      metaDescription,
      shortDescription,
      slug: finalSlug,
      status,
      images,
    });

    res.status(201).json({
      success: true,
      message: "CMS created successfully",
      data: cms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};