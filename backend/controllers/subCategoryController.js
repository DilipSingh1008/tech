const SubCategory = require('../models/SubCategory');

// Create subcategory
exports.createSubCategory = async (req, res) => {
  const { name, image, categoryId } = req.body;
  const subcategory = await SubCategory.create({ name, image, category: categoryId });
  res.json(subcategory);
};

// Get all subcategories
exports.getSubCategories = async (req, res) => {
  const subcategories = await SubCategory.find().populate('category', 'name');
  res.json(subcategories);
};

// Update subcategory
exports.updateSubCategory = async (req, res) => {
  const { name, image, status } = req.body;
  const subcategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    { name, image, status },
    { new: true }
  );
  res.json(subcategory);
};

// Delete subcategory
exports.deleteSubCategory = async (req, res) => {
  await SubCategory.findByIdAndDelete(req.params.id);
  res.json({ message: 'Subcategory deleted' });
};