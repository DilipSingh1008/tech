const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, catid } = req.body;
    console.log(req.body);
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const categoryData = {
      name,
      catid: catid || null,
    };
    if (req.file) {
      categoryData.icon = `/uploads/subcategories/${req.file.filename}`;
    }

    const category = await Category.create(categoryData);

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Get all categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({
//       createdAt: -1,
//     });

//     res.json(categories);
//   } catch (error) {
//     console.error("Error fetching categories:", error.message);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch categories", details: error.message });
//   }
// };
exports.getCategories = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      order = "desc",
      catid,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (catid === "null") {
      filter.catid = null;
    } else if (catid) {
      filter.catid = catid;
    }

    const total = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }

    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    if (req.file) {
      updateData.icon = `/uploads/subcategories/${req.file.filename}`;
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
// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndDelete(req.params.id);

//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//     if (category.icon) {
//       const imagePath = path.join(__dirname, "..", category.icon);
//       fs.unlink(imagePath, (err) => {
//         if (err) console.error("Failed to delete image file:", err);
//         else console.log("Image deleted:", imagePath);
//       });
//     }

//     res.json({ message: "Category and image deleted" });
//   } catch (error) {
//     console.error("Error deleting category:", error.message);
//     res
//       .status(500)
//       .json({ error: "Failed to delete category", details: error.message });
//   }
// };
const deleteImageFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error("Failed to delete image file:", err);
    else console.log("Image deleted:", fullPath);
  });
};

const deleteCategoryRecursive = async (categoryId) => {
  const subcategories = await Category.find({ catid: categoryId });

  for (const sub of subcategories) {
    await deleteCategoryRecursive(sub._id); // Recursive delete
  }

  const category = await Category.findByIdAndDelete(categoryId);
  if (category && category.icon) deleteImageFile(category.icon);
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    await deleteCategoryRecursive(categoryId);

    res.json({
      message: "Category, its subcategories, and all images deleted",
    });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({
      error: "Failed to delete category",
      details: error.message,
    });
  }
};
