const ProductItem = require("../models/productItemSchema.js");
const fs = require("fs");
const path = require("path");


// ✅ CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, salePrice, stock, category } =
      req.body;

    const images = req.files
      ? req.files.map((file) => `${req.body.folder}/${file.filename}`)
      : [];

    const product = new ProductItem({
      name,
      slug,
      description,
      price,
      salePrice,
      stock,
      category,
      images,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const products = await ProductItem.find(query)
      .populate("category", "name")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ProductItem.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductItem.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await ProductItem.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const { name, slug, description, price, salePrice, stock, category } =
      req.body;

    product.name = name ?? product.name;
    product.slug = slug ?? product.slug;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.salePrice = salePrice ?? product.salePrice;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;

    if (req.files && req.files.length > 0) {
      // ⭐ old images delete
      product.images.forEach((img) => {
        const imgPath = path.join("uploads", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      product.images = req.files.map(
        (file) => `${req.body.folder}/${file.filename}`
      );
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductItem.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // ⭐ delete images
    product.images.forEach((img) => {
      const imgPath = path.join("uploads", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ STATUS TOGGLE
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await ProductItem.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    product.status = !product.status;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};