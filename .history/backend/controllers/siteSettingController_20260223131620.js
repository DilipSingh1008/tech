const Setting = require("../models/Setting");

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