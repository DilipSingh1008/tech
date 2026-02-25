const fs = require("fs");
const path = require("path");
const Service = require("../models/Service.js");

exports.createService = async (req, res) => {
  try {
    const {
      name,
      slug,
      shortDescription,
      description,
      status,
      category,
      subCategory,
    } = req.body;

    if (!name || !shortDescription || !slug || !category || !subCategory) {
      return res.status(400).json({
        message:
          "Required fields missing (Name, Slug, Description, or Categories)",
      });
    }

    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // 3. Service Object banayein
    const serviceData = {
      name,
      slug,
      shortDescription,
      description,
      category,
      subCategory,
      status: status === "true" || status === true,
    };

    if (req.files) {
      if (req.files.galleryImages) {
        serviceData.galleryImages = req.files.galleryImages.map(
          (file) => file.path,
        );
      }

      if (req.files.pdfFile) {
        serviceData.pdfFile = req.files.pdfFile[0].path;
      }
    }

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({ message: "Service created successfully", service });
  } catch (err) {
    console.error("Error in createService:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const totalItems = await Service.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const services = await Service.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: services,
      pagination: { totalPages, currentPage: page, totalItems },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.galleryImages && service.galleryImages.length > 0) {
      service.galleryImages.forEach((filePath) => {
        const fullPath = path.join(__dirname, "..", filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (err) => {
            if (err) console.error("Error deleting gallery image:", err);
          });
        }
      });
    }

    if (service.pdfFile) {
      const pdfPath = path.join(__dirname, "..", service.pdfFile);
      if (fs.existsSync(pdfPath)) {
        fs.unlink(pdfPath, (err) => {
          if (err) console.error("Error deleting PDF file:", err);
        });
      }
    }

    if (service.featuredImage) {
      const featuredPath = path.join(__dirname, "..", service.featuredImage);
      if (fs.existsSync(featuredPath)) {
        fs.unlink(featuredPath, (err) => {
          if (err) console.error("Error deleting featured image:", err);
        });
      }
    }

    await Service.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Service and associated files deleted successfully" });
  } catch (err) {
    console.error("Error in deleteService:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ data: service });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const {
      name,
      slug,
      shortDescription,
      description,
      status,
      category,
      subCategory,
    } = req.body;

    if (!name || !shortDescription || !slug || !category || !subCategory) {
      return res.status(400).json({
        message:
          "Required fields missing (Name, Slug, Description, or Categories)",
      });
    }

    service.name = name;
    service.slug = slug;
    service.shortDescription = shortDescription;
    service.description = description;
    service.status = status === "true" || status === true;
    service.category = category;
    service.subCategory = subCategory;

    if (req.files && req.files.galleryImages) {
      if (service.galleryImages && service.galleryImages.length > 0) {
        service.galleryImages.forEach((filePath) => {
          const fullPath = path.join(__dirname, "..", filePath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
      }

      service.galleryImages = req.files.galleryImages.map((file) => file.path);
    }

    if (req.files && req.files.pdfFile) {
      if (service.pdfFile) {
        const oldPdfPath = path.join(__dirname, "..", service.pdfFile);
        if (fs.existsSync(oldPdfPath)) fs.unlinkSync(oldPdfPath);
      }

      service.pdfFile = req.files.pdfFile[0].path;
    }

    await service.save();

    res.status(200).json({ message: "Service updated successfully", service });
  } catch (err) {
    console.error("Error in updateService:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// controllers/serviceController.js

exports.toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Toggle status
    service.status = !service.status;
    await service.save();

    res.status(200).json({
      message: "Service status updated successfully",
      status: service.status,
    });
  } catch (err) {
    console.error("Error in toggleServiceStatus:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
