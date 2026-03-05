const express = require("express");
const router = express.Router();

const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  toggleVendorStatus,
} = require("../controllers/vendorContorller");

// ============================
// CREATE Vendor
// POST /api/vendors
// ============================
router.post("/", createVendor);

// ============================
// GET All Vendors
// GET /api/vendors
// ============================
router.get("/", getAllVendors);

// ============================
// GET Single Vendor
// GET /api/vendors/:id
// ============================
router.get("/:id", getVendorById);

// ============================
// UPDATE Vendor
// PUT /api/vendors/:id
// ============================
router.put("/:id", updateVendor);

// ============================
// DELETE Vendor
// DELETE /api/vendors/:id
// ============================
router.delete("/:id", deleteVendor);

router.patch("/toggle-status/:id", toggleVendorStatus)

module.exports = router;