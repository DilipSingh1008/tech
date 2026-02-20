const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category"); // Needed for population/checks

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, image, categoryId } = req.body;

    // Validate required fields
    if (!name || !categoryId) {
      return res
        .status(400)
        .json({ error: "Name and categoryId are required" });
    }

    // Optional: check if category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    // Create subcategory
    const subcategory = await SubCategory.create({
      name,
      image, // optional
      category: categoryId,
    });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error("Error creating subcategory:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create subcategory", details: error.message });
  }
};

// Get all subcategories
exports.getSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate("category", "name"); // Show category name in response
    res.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch subcategories", details: error.message });
  }
};

// Get subcategories by category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({
      category: req.params.categoryId,
    }).populate("category", "name");
    res.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories by category:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch subcategories", details: error.message });
  }
};

// Update subcategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, image, status } = req.body;
    const subcategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, image, status },
      { new: true },
    );

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.json(subcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error.message);
    res
      .status(500)
      .json({ error: "Failed to update subcategory", details: error.message });
  }
};

// Delete subcategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.json({ message: "Subcategory deleted" });
  } catch (error) {
    console.error("Error deleting subcategory:", error.message);
    res
      .status(500)
      .json({ error: "Failed to delete subcategory", details: error.message });
  }
};
