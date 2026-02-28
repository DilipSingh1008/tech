const express = require("express");
const router = express.Router();
const {
  createService,
  getServices,
  deleteService,
  getServiceById,
  updateService,
  toggleServiceStatus,
  getActiveCategories,
} = require("../controllers/serviceController");
const upload = require("../middlewares/upload");

const uploadFields = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
  { name: "pdfFile", maxCount: 1 },
]);

router.post("/", uploadFields, createService);
router.get("/", getServices);
router.get("/active", getActiveCategories);

router.put("/:id", uploadFields, updateService);
router.delete("/:id", deleteService);
router.get("/:id", getServiceById);
router.patch("/togal/:id", toggleServiceStatus);

module.exports = router;
