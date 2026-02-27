const BlogCategory = require("../models/blogCategoryModel.js");

exports.createBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await BlogCategory.create({ name });

    res.status(201).json({
      success: true,
      message: "Blog Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlogCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const validSortFields = ["name", "createdAt"];
    const field = validSortFields.includes(sortField) ? sortField : "createdAt";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const total = await BlogCategory.countDocuments(query);

    const categories = await BlogCategory.find(query)
      .sort({ [field]: sortOrder === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBlogCategory = async (req, res) => {
  try {
    const updated = await BlogCategory.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Blog Category updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlogCategory = async (req, res) => {
  try {
    await BlogCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleBlogCategoryStatus = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    category.status = !category.status;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category status updated",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
