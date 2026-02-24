const  express = require("express");
const  { createService } = require("../controllers/serviceController.js")
const   upload  = require("../middlewares/upload.js");

const router = express.Router();

const uploadFields = upload.fields([{ name: "featuredImage", maxCount: 1 }]);

router.post("/create", uploadFields, createService);

module.exports =  router;

