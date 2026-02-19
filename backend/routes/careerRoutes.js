express = require("express");
const router = express.Router();
const {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,
} = require("../controllers/careerController");

// Public: Get all careers
router.get("/", getCareers);

// Admin: Add new career (optional)
router.post("/", createCareer);
router.put("/:id", updateCareer);
router.delete("/:id", deleteCareer);

module.exports = router;

module.exports = router;
