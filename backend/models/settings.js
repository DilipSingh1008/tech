const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["site", "social", "mail", "payment", "sms"],
      required: true,
    },

    // ===== SITE =====
    site_name: { type: String, default: "" },
    site_address: { type: String, default: "" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },

    // ===== SOCIAL =====
    facebook_link: { type: String, default: "" },
    instagram_link: { type: String, default: "" },

    
    // ===== PAYMENT =====
    razorpay_key_id: { type: String, default: "" },
    razorpay_key_secret: { type: String, default: "" },
    currency: { type: String, default: "INR" },

    // ===== SMS =====
    sms_provider: { type: String, default: "" },
    sms_api_key: { type: String, default: "" },
    sms_sender_id: { type: String, default: "" },

    // ===== MAIL =====
    mail_host: { type: String, default: "" },
    mail_port: { type: Number, default: 0 },
    mail_user: { type: String, default: "" },
    mail_pass: { type: String, default: "" },
    mail_from: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Setting", settingSchema);
