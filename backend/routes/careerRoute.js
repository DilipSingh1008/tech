const express = require("express");
const router = express.Router();
const careerController = require("../controllers/careerController");

// CRUD
router.post("/", careerController.createCareer);
router.get("/", careerController.getCareers);
router.get("/:id", careerController.getCareerById);
router.put("/:id", careerController.updateCareer);
router.delete("/:id", careerController.deleteCareer);

// Toggle status
router.patch("/toggle-status/:id", careerController.toggleStatus);

module.exports = router;
