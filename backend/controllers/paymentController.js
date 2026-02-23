const Setting = require("../models/settings.js");

exports.getPaymentSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ section: "payment" });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Payment setting not found",
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

exports.updatePaymentSetting = async (req, res) => {
  try {
    const { razorpay_key_id, razorpay_key_secret, currency } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { section: "payment" },
      {
        razorpay_key_id,
        razorpay_key_secret,
        currency,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment setting updated",
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