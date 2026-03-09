const MediaItem = require("../models/MediaItem");

exports.getAllMediaItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      order = "desc",
      search = "",
      category = "",
    } = req.query;

    const query = {
      isDeleted: false,
      ...(search && { title: { $regex: search, $options: "i" } }),
      ...(category && { category }),
    };

    const total = await MediaItem.countDocuments(query);

    const mediaItems = await MediaItem.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      data: mediaItems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMediaItem = async (req, res) => {
  try {
    const item = await MediaItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createMediaItem = async (req, res) => {
  try {
    const {
      title,
      url = "",
      link = "",
      category = "",
      type = "image",
    } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newItem = new MediaItem({
      title,
      url,
      link,
      category,
      type,
      icon: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : null,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMediaItem = async (req, res) => {
  try {
    const { title, url, link, category, type } = req.body;

    const updateData = {
      ...(title !== undefined && { title }),
      ...(url !== undefined && { url }),
      ...(link !== undefined && { link }),
      ...(category !== undefined && { category }),
      ...(type !== undefined && { type }),
    };

    if (req.file) {
      updateData.icon = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedItem = await MediaItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMediaItem = async (req, res) => {
  try {
    const deletedItem = await MediaItem.findById({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });

    deletedItem.isDeleted = true;
    await deletedItem.save();

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
