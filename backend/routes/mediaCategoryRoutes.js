const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/mediaCategoryController");

router.get("/", controller.getCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", upload.single("icon"), controller.createCategory);
router.put("/:id", upload.single("icon"), controller.updateCategory);
router.delete("/:id", controller.deleteCategory);
router.patch("/status/:id", controller.toggleStatus);

module.exports = router;
