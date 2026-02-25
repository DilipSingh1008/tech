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

    //  validation
    if (!category)
      return res.status(400).json({ message: "Category required" });
    if (!name) return res.status(400).json({ message: "Name required" });
    if (!price) return res.status(400).json({ message: "Price required" });

    const images = req.files ? req.files.map((f) => f.path) : [];

    const product = await productItemSchema.create({
      category,
      name,
      salePrice: price,
      slug,
      price: mrp,
      subCategory: subCategory,
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

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const products = await productItemSchema
      .find(query)
      .populate("category", "name") //  category name
      .populate("subCategory", "name") //  subcategory name
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await productItemSchema.countDocuments(query);

    res.json({
      data: products,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  GET SINGLE CATEGORY
exports.getProdutsById = async (req, res) => {
  try {
    const category = await productItemSchema
      .findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  UPDATE CATEGORY

exports.updateProduct = async (req, res) => {
  try {
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

    //  validation
    if (!category)
      return res.status(400).json({ message: "Category required" });
    if (!name) return res.status(400).json({ message: "Name required" });
    if (!price) return res.status(400).json({ message: "Price required" });

    const product = await productItemSchema.findById(req.params.id);

    // log

    if (!product) return res.status(404).json({ message: "Product not found" });

    //  keep images sent from frontend
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    //  find deleted images
    const deletedImages = product.images.filter(
      (img) => !existingImages.includes(img),
    );

    //  delete from server
    deletedImages.forEach((img) => {
      if (fs.existsSync(img)) fs.unlinkSync(img);
    });

    //  new uploaded images
    const newImages = req.files ? req.files.map((f) => f.path) : [];

    //  final images
    const finalImages = [...existingImages, ...newImages];

    const updated = await productItemSchema.findByIdAndUpdate(
      req.params.id,
      {
        category,
        name,
        salePrice: price,
        slug,
        price: mrp,
        subCategory: subCategory,
        shortDescription,
        mainDescription,
        images: finalImages,
      },
      { new: true },
    );

    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await productItemSchema.findByIdAndDelete(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ STATUS TOGGLE
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await productItemSchema.findById(req.params.id);

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
