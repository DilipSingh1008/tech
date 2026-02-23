const Setting = require("../models/settings.js");

exports.getSmsSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ section: "sms" });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "SMS setting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.updateSmsSetting = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.sms_provider !== undefined)
      updateData.sms_provider = req.body.sms_provider;

    if (req.body.sms_api_key !== undefined)
      updateData.sms_api_key = req.body.sms_api_key;

    if (req.body.sms_sender_id !== undefined)
      updateData.sms_sender_id = req.body.sms_sender_id;

    const setting = await Setting.findOneAndUpdate(
      { section: "sms" },
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "SMS setting updated",
      data: setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};