const ProductCategory = require("../models/productCategory.js");

const fs = require("fs");
const path = require("path");

// ✅ CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;

    const category = new ProductCategory({
      name,
      slug,
      description,
      status,
      image: req.file ? `${req.body.folder}/${req.file.filename}` : "",
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET ALL CATEGORY (pagination + search + sort)
exports.getCategories = async (req, res) => {
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

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const categories = await ProductCategory.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ProductCategory.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET SINGLE CATEGORY
exports.getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;

    const category = await ProductCategory.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.name = name ?? category.name;
    category.slug = slug ?? category.slug;
    category.description = description ?? category.description;
    category.status = status ?? category.status;

    if (req.file) {
      const oldPath = path.join("uploads", category.image);

      if (category.image && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      
      category.image = `${req.body.folder}/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndDelete(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ STATUS TOGGLE
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.status = !category.status;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
