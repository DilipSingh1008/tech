const express = require("express");
const router = express.Router();

const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  updatePermissions,
  getPermissions,
  getModules,
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/roleController");

router.get("/module/all", getAllModules);
router.get("/module", getModules);
router.post("/module", createModule);
router.put("/module/:id", updateModule);
router.delete("/module/:id", deleteModule);

router.post("/", createRole);
router.get("/", getRoles);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
router.put(
  "/:id/permissions",
 
  updatePermissions
);

//  get permissions
router.get(
  "/:id/permissions",
  
  getPermissions
);

module.exports = router;
