const Category = require("../models/Category");

// Create category
exports.createCategory = async (req, res) => {
  const { name, icon } = req.body;
  const category = await Category.create({ name, icon });
  res.json(category);
};

// Get all categories
exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

// Update category
exports.updateCategory = async (req, res) => {
  const { name, icon, status } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, icon, status },
    { new: true },
  );
  res.json(category);
};

// Delete category
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
