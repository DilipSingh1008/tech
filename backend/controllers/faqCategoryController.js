const FaqCategory = require("../models/faqCategoryModel.js");

// CREATE
exports.createFaqCategory = async (req, res) => {
  try {
    const { category, description } = req.body;

    const newCategory = await FaqCategory.create({
      category,
      description,
    });

    res.status(201).json({
      success: true,
      message: "FAQ Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL (Search + Pagination + Sorting)
exports.getFaqCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const validSortFields = ["category", "description", "createdAt"];
    const field = validSortFields.includes(sortField) ? sortField : "createdAt";

    const query = {
      $or: [
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const total = await FaqCategory.countDocuments(query);

    const categories = await FaqCategory.find(query)
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

// UPDATE
exports.updateFaqCategory = async (req, res) => {
  try {
    const updated = await FaqCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "FAQ Category updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteFaqCategory = async (req, res) => {
  try {
    await FaqCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "FAQ Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
