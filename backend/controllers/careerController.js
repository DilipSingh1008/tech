const Career = require("../models/careerModel");

exports.createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, data: career });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getCareers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField = "title",
      sortOrder = "asc",
    } = req.query;

    const query = {
      isDeleted: false,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Career.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const careers = await Career.find(query)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: careers,
      pagination: { total, totalPages, page: Number(page) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single Career
exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career)
      return res
        .status(404)
        .json({ success: false, error: "Career not found" });
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Career
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!career)
      return res
        .status(404)
        .json({ success: false, error: "Career not found" });
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Career
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!career)
      return res
        .status(404)
        .json({ success: false, error: "Career not found" });

    career.isDeleted = true;
    await career.save();

    res.status(200).json({ success: true, message: "Career deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Toggle Status
exports.toggleStatus = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career)
      return res
        .status(404)
        .json({ success: false, error: "Career not found" });

    career.status = !career.status;
    await career.save();

    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
