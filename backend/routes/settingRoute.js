const express = require("express");
const router = express.Router();
const controller = require("../controllers/siteSettingController.js");
const  upload  = require("../middlewares/upload.js");
const { getSocialSetting, updateSocialSetting } = require("../controllers/socailController.js");
const { getMailSetting, updateMailSetting } = require("../controllers/mailController.js");
const { getPaymentSetting, updatePaymentSetting } = require("../controllers/paymentController.js");
const { getSmsSetting, updateSmsSetting } = require("../controllers/smsController.js");

router.get("/site", controller.getSiteSetting);
router.put(
  "/site",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  controller.updateSiteSetting
);
router.get("/social", getSocialSetting);
router.put("/social", updateSocialSetting);

router.get("/mail", getMailSetting);
router.put("/mail", updateMailSetting);

router.get("/payment", getPaymentSetting);
router.put("/payment", updatePaymentSetting);

router.get("/sms", getSmsSetting);
router.put("/sms", updateSmsSetting);

module.exports = router; 