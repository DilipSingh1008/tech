const NewsItem = require("../models/newsSchema.js");
const fs = require("fs");
const path = require("path");

exports.createNews = async (req, res) => {
  try {
    const { title, shortDescription, mainDescription } = req.body;

    const images = req.files
      ? req.files.map((file) => `${req.body.folder}/${file.filename}`)
      : [];

    const news = new NewsItem({
      title,
      shortDescription,
      mainDescription,
      images,
    });

    await news.save();

    res.status(201).json({
      success: true,
      message: "News created",
      data: news,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getNews = async (req, res) => {
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

    const news = await NewsItem.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await NewsItem.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: news,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET SINGLE NEWS
exports.getNewsById = async (req, res) => {
  try {
    const news = await NewsItem.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    res.status(200).json(news);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ UPDATE NEWS
exports.updateNews = async (req, res) => {
  try {
    const news = await NewsItem.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    const { title, shortDescription, mainDescription } = req.body;

    news.title = title ?? news.title;
    news.shortDescription = shortDescription ?? news.shortDescription;
    news.mainDescription = mainDescription ?? news.mainDescription;

    if (req.files && req.files.length > 0) {
      // ⭐ delete old images
      news.images.forEach((img) => {
        const imgPath = path.join("uploads", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      news.images = req.files.map(
        (file) => `${req.body.folder}/${file.filename}`,
      );
    }

    await news.save();

    res.status(200).json({
      success: true,
      message: "News updated",
      data: news,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ DELETE NEWS
exports.deleteNews = async (req, res) => {
  try {
    const news = await NewsItem.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    // ⭐ delete images
    news.images.forEach((img) => {
      const imgPath = path.join("uploads", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    res.status(200).json({
      success: true,
      message: "News deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ STATUS TOGGLE
exports.toggleNewsStatus = async (req, res) => {
  try {
    const news = await NewsItem.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    news.status = !news.status;
    await news.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: news,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
