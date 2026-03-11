const MediaPost = require("../models/MediaPost");
const fs = require("fs");
const path = require("path");

exports.createMediaPost = async (req, res) => {
  try {
    const { title, year, month, publishDate } = req.body;

    if (!req.file)
      return res.status(400).json({ success: false, error: "Image required" });

    const imagePath = `/uploads/media-posts/${req.file.filename}`;

    const newPost = await MediaPost.create({
      title,
      year,
      month,
      publishDate,
      image: imagePath,
      isDeleted: false,
    });
    // console.log(newPost);
    res.json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getMediaPosts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = { isDeleted: false };
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await MediaPost.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const mediaPosts = await MediaPost.find(query)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: mediaPosts,
      pagination: { total, totalPages, page, limit },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMediaPost = async (req, res) => {
  try {
    const post = await MediaPost.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, error: "Media post not found" });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateMediaPost = async (req, res) => {
  try {
    const { title, year, month, publishDate } = req.body;
    const updateData = { title, year, month, publishDate };

    if (req.file) {
      updateData.image = req.file.path;

      const post = await MediaPost.findById(req.params.id);
      if (post && post.image && fs.existsSync(post.image)) {
        fs.unlinkSync(post.image);
      }
    }

    const updatedPost = await MediaPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );
    res.json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteMediaPost = async (req, res) => {
  try {
    const post = await MediaPost.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!post)
      return res
        .status(404)
        .json({ success: false, error: "Media post not found" });

    post.isDeleted = true;
    await post.save();

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const post = await MediaPost.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, error: "Media post not found" });

    post.status = !post.status;
    await post.save();

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
