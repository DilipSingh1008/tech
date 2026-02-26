const ManageFaq = require("../models/ManageFaqModel");

// CREATE FAQ
exports.createManageFaq = async (req, res) => {
  try {
    const { category, question, answer } = req.body;

    const newFaq = await ManageFaq.create({ category, question, answer });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: newFaq,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL FAQs (Search + Pagination + Sorting)
exports.getManageFaqs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {
      $or: [
        { category: { $regex: search, $options: "i" } },
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;
    const total = await ManageFaq.countDocuments(query);

    const faqs = await ManageFaq.find(query)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: faqs,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE FAQ
exports.updateManageFaq = async (req, res) => {
  try {
    const updated = await ManageFaq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE FAQ
exports.deleteManageFaq = async (req, res) => {
  try {
    await ManageFaq.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.toggleFaqStatus = async (req, res) => {
  try {
    const faq = await ManageFaq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.status = !faq.status;
    await faq.save();

    res
      .status(200)
      .json({ success: true, message: "FAQ status updated", data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
