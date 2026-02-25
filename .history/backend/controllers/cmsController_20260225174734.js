const CMS = require("../models/cms.js");
const fs = require("fs");
const path = require("path");
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


exports.getAllCMS = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // ⭐ search query
    const query = {
      title: { $regex: search, $options: "i" },
    };

    // ⭐ sorting
    const sortOrder = order === "asc" ? 1 : -1;

    const data = await CMS.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CMS.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSingleCMS = async (req, res) => {
  try {
    const { id } = req.params;

    const cms = await CMS.findOne({
      $or: [{ _id: id }, { slug: id }],
    });

    if (!cms) {
      return res.status(404).json({ message: "CMS not found" });
    }

    res.status(200).json({
      success: true,
      data: cms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCMS = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      meta,
      metaDescription,
      shortDescription,
      slug,
      status,
      folder,
      existingImages,
    } = req.body;

    const cms = await CMS.findById(id);
    if (!cms) {
      return res.status(404).json({ message: "CMS not found" });
    }

    // ⭐ slug update
    const finalSlug = slug ? makeSlug(slug) : makeSlug(title || cms.title);

    // ⭐ duplicate slug check
    const exists = await CMS.findOne({ slug: finalSlug, _id: { $ne: id } });
    if (exists) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // ⭐ parse existing images from frontend
    const existingImagesFromFrontend = JSON.parse(existingImages || "[]");

    console.log("existingImagesFromFrontend", existingImagesFromFrontend)

    // ⭐ images to delete
    const imagesToDelete = cms.images.filter(
      (img) => !existingImagesFromFrontend.includes(img)
    );

    // ⭐ delete images from folder
    imagesToDelete.forEach((img) => {
      const filePath = path.join(__dirname, "..", img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // ⭐ new images upload
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(
        (file) => `/uploads/${folder || "default"}/${file.filename}`
      );
    }

    // ⭐ final images merge
    cms.images = [...existingImagesFromFrontend, ...newImages];

    // ⭐ other fields update
    cms.title = title || cms.title;
    cms.meta = meta || cms.meta;
    cms.metaDescription = metaDescription || cms.metaDescription;
    cms.shortDescription = shortDescription || cms.shortDescription;
    cms.slug = finalSlug;
    cms.status = status !== undefined ? status === "true" || status === true : cms.status;

    await cms.save();

    res.status(200).json({
      success: true,
      message: "CMS updated successfully",
      data: cms,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};


exports.toggleCMSStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const cms = await CMS.findById(id);
    if (!cms) {
      return res.status(404).json({ message: "CMS not found" });
    }

    // ⭐ toggle logic
    cms.status = !cms.status;

    await cms.save();

    res.status(200).json({
      success: true,
      message: "CMS status toggled",
      data: cms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};