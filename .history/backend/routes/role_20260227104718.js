const express = require("express");
const router = express.Router();

const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  updatePermissions,
  getPermissions,
} = require("../controllers/roleController");

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
