const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ error: "Name and icon are required" });
    }

    const category = await Category.create({
      name,
      icon: `/uploads/categories/${req.file.filename}`,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch categories", details: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, status } = req.body;

    const updateData = { name, status };

    if (req.file) {
      updateData.icon = `/uploads/categories/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.icon) {
      const imagePath = path.join(__dirname, "..", category.icon);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image file:", err);
        else console.log("Image deleted:", imagePath);
      });
    }

    res.json({ message: "Category and image deleted" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res
      .status(500)
      .json({ error: "Failed to delete category", details: error.message });
  }
};
