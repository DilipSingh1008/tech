const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

exports.createBanner = async (req, res) => {
  try {
    const { title, url } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ error: "Title and Image are required" });
    }

    const banner = await Banner.create({
      title,
      url: url || "",
      image: `/uploads/Banner/${req.file.filename}`,
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create banner" });
  }
};

exports.getBanners = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      order = "desc",
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Banner.countDocuments(filter);

    const banners = await Banner.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: banners,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { title, url, status } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (status !== undefined) updateData.status = status;

    if (req.file) {
      const oldBanner = await Banner.findById(req.params.id);
      if (!oldBanner)
        return res.status(404).json({ error: "Banner not found" });
      if (oldBanner.image) {
        const oldImagePath = path.join(__dirname, "..", oldBanner.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        }
      }
      updateData.image = `/uploads/Banner/${req.file.filename}`;
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!banner) return res.status(404).json({ error: "Banner not found" });

    res.json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update banner" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    if (banner.image) {
      const imgPath = path.join(__dirname, "..", banner.image);
      fs.unlink(imgPath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    res.json({ message: "Banner deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete banner" });
  }
};
