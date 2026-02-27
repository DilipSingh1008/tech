const Blog = require("../models/blogSchema.js");
const fs = require("fs");
const path = require("path");
const BlogCategory = require("../models/blogCategoryModel.js");
// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, shortDescription, mainDescription, categoryId } = req.body;

    const images = req.files
      ? req.files.map((file) => `${req.body.folder}/${file.filename}`)
      : [];

    const blog = new Blog({
      title,
      shortDescription,
      mainDescription,
      categoryId,
      images,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created",
      data: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET BLOGS WITH PAGINATION, SEARCH, SORT
exports.getBlogs = async (req, res) => {
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
      title: { $regex: search, $options: "i" },
    };

    const blogs = await Blog.find(query)
      .populate("categoryId", "name status")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET SINGLE BLOG
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "categoryId",
      "name status",
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { title, shortDescription, mainDescription, categoryId } = req.body;

    blog.title = title ?? blog.title;
    blog.shortDescription = shortDescription ?? blog.shortDescription;
    blog.mainDescription = mainDescription ?? blog.mainDescription;
    blog.categoryId = categoryId ?? blog.categoryId;

    if (req.files && req.files.length > 0) {
      // delete old images
      blog.images.forEach((img) => {
        const imgPath = path.join("uploads", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      blog.images = req.files.map(
        (file) => `${req.body.folder}/${file.filename}`,
      );
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated",
      data: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find({ status: true })
      .select("_id name")
      .sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.images.forEach((img) => {
      const imgPath = path.join("uploads", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    res.status(200).json({
      success: true,
      message: "Blog deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// TOGGLE STATUS
exports.toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.status = !blog.status;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
