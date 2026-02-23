const Setting = require("../models/settings.js");

exports.getMailSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ section: "mail" });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Mail setting not found",
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


exports.updateMailSetting = async (req, res) => {
  try {
    const {
      mail_host,
      mail_port,
      mail_user,
      mail_pass,
      mail_from,
    } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { section: "mail" },
      {
        mail_host,
        mail_port,
        mail_user,
        mail_pass,
        mail_from,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Mail setting updated",
      data: setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};