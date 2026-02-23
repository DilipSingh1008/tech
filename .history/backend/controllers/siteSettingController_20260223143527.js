const Setting = require("../models/settings.js");

exports.getSiteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ section: "site" });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Site setting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateSiteSetting = async (req, res) => {
  try {
    const { site_name, site_address } = req.body;

    const updateData = {
      site_name,
      site_address,
    };

    // agar file upload aayi hai
    if (req.files?.logo) {
      updateData.logo = `/uploads/setting/${req.files.logo[0].filename}`;
    }

    if (req.files?.favicon) {
      updateData.favicon = `/uploads/setting/${req.files.favicon[0].filename}`;
    }

    const setting = await Setting.findOneAndUpdate(
      { section: "site" },
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Site setting updated",
      data: setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};