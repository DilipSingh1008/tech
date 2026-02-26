const express = require("express");
const router = express.Router();
const manageFaqController = require("../controllers/manageFaqController");

// CRUD routes for Manage FAQ
router.post("/", manageFaqController.createManageFaq);
router.get("/", manageFaqController.getManageFaqs);
router.put("/:id", manageFaqController.updateManageFaq);
router.delete("/:id", manageFaqController.deleteManageFaq);
router.patch("/toggle-status/:id", manageFaqController.toggleFaqStatus);

module.exports = router;
