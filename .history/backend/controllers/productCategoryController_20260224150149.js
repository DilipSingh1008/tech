const ProductCategory = require("../models/productCategory.js");

const fs = require("fs");
const path = require("path");
const productCategory = require("../models/productCategory.js");
const productItemSchema = require("../models/productItemSchema.js");

// ✅ CREATE CATEGORY
exports.createProduct = async (req, res) => {
  try {
    console.log("BODY =>", req.body);
    console.log("FILES =>", req.files);

    const {
      category,
      name,
      price,
      slug,
      mrp,
      subCategory,
      shortDescription,
      mainDescription,
    } = req.body;

    // ⭐ validation
    if (!category) return res.status(400).json({ message: "Category required" });
    if (!name) return res.status(400).json({ message: "Name required" });
    if (!price) return res.status(400).json({ message: "Price required" });

    const images = req.files ? req.files.map((f) => f.path) : [];

    const product = await productItemSchema.create({
      category,
      name,
      salePrice: price,
      slug,
      price: mrp,
      subCategory,
      shortDescription,
      mainDescription,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL CATEGORY (pagination + search + sort)
exports.getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      order = "desc",
      search = "",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const products = await productItemSchema.find(query)
      .populate("category", "name")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
exports.updateProduct = async (req, res) => {
  try {
    console.log("UPDATE BODY =>", req.body);
    console.log("UPDATE FILES =>", req.files);

    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID required" });

    const images = req.files ? req.files.map((f) => f.path) : [];

    const updateData = { ...req.body };

    if (images.length) {
      updateData.images = images;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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
