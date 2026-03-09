const MediaCategory = require("../models/MediaCategory");
const fs = require("fs");

exports.getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = { isDeleted: false };
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await MediaCategory.countDocuments(query);
    const categories = await MediaCategory.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      data: categories,
      pagination: { total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!req.file) return res.status(400).json({ message: "Icon is required" });

    const category = await MediaCategory.create({
      title,
      icon: `/${req.file.path.replace(/\\/g, "/")}`,
    });

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await MediaCategory.findById(req.params.id);
    if (!category || category.isDeleted)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await MediaCategory.findById(req.params.id);
    if (!category || category.isDeleted)
      return res.status(404).json({ message: "Category not found" });

    if (req.body.title) category.title = req.body.title;
    if (req.file) {
      // delete old icon
      if (category.icon && fs.existsSync(category.icon))
        fs.unlinkSync(category.icon);
      category.icon = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await MediaCategory.findById(req.params.id);
    if (!category || category.isDeleted)
      return res.status(404).json({ message: "Category not found" });

    category.isDeleted = true;
    await category.save();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const category = await MediaCategory.findById(req.params.id);
    if (!category || category.isDeleted)
      return res.status(404).json({ message: "Category not found" });

    category.status = !category.status;
    await category.save();
    res.json({ message: "Status updated", data: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
