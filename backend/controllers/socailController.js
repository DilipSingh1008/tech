const Setting = require("../models/settings.js");

exports.getSocialSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ section: "social" });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Social setting not found",
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

exports.updateSocialSetting = async (req, res) => {
  try {
    const { facebook, instagram, linkedin} = req.body;

    const setting = await Setting.findOneAndUpdate(
      { section: "social" },
      {
        facebook_link: facebook,
        instagram_link: instagram,
        linkedin_link: linkedin,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Social setting updated",
      data: setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};