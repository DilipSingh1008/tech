const Vendor = require("../models/vendorModel");

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const mobileRegex = /^[6-9]\d{9}$/;

exports.createVendor = async (req, res) => {
  try {
    const {
      firmName,
      gst,
      contactName,
      mobile,
      address,
      country,
      state,
      city,
    } = req.body;

    if (
      !firmName ||
      !gst ||
      !contactName ||
      !mobile ||
      !address ||
      !country ||
      !state ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!gstRegex.test(gst.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid GST Number format",
      });
    }

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mobile Number",
      });
    }

    const existingVendor = await Vendor.findOne({
      gst: gst.toUpperCase(),
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor with this GST already exists",
      });
    }

    const vendor = await Vendor.create({
      firmName: firmName.trim(),
      gst: gst.toUpperCase().trim(),
      contactName: contactName.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      country: country.trim().toLowerCase(),
      state: state.trim().toLowerCase(),
      city: city.trim().toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.getAllVendors = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const search = req.query.search || "";
//     const sortField = req.query.sortField || "createdAt";
//     const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

//     const skip = (page - 1) * limit;

//     const searchFilter = {
//       $or: [
//         { firmName: { $regex: search, $options: "i" } },
//         { contactName: { $regex: search, $options: "i" } },
//         { gst: { $regex: search, $options: "i" } },
//         { city: { $regex: search, $options: "i" } },
//       ],
//     };

//     const total = await Vendor.countDocuments(search ? searchFilter : {});

//     const vendors = await Vendor.find(search ? searchFilter : {})
//       .sort({ [sortField]: sortOrder })
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({
//       success: true,
//       totalRecords: total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       data: vendors,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const baseFilter = { isDeleted: false };

    const finalFilter = search
      ? {
          ...baseFilter,
          $or: [
            { firmName: { $regex: search, $options: "i" } },
            { contactName: { $regex: search, $options: "i" } },
            { gst: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
          ],
        }
      : baseFilter;

    const total = await Vendor.countDocuments(finalFilter);

    const vendors = await Vendor.find(finalFilter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalRecords: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Vendor ID",
    });
  }
};
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (req.body.gst && !gstRegex.test(req.body.gst.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid GST format",
      });
    }

    if (req.body.mobile && !mobileRegex.test(req.body.mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mobile Number",
      });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.isDeleted = true;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Vendor ID",
    });
  }
};

exports.toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    vendor.status = !vendor.status;
    await vendor.save();
    res.status(200).json({
      success: true,
      message: `Vendor is now ${vendor.status ? "Active" : "Inactive"}`,
      data: vendor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Vendor ID",
    });
  }
};
