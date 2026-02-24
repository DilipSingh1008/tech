import express from "express";
import { createService } from "../controllers/serviceController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

const uploadFields = upload.fields([{ name: "featuredImage", maxCount: 1 }]);

router.post("/create", uploadFields, createService);

export default router;
app.use("/api/services", serviceRoutes);
Test;
