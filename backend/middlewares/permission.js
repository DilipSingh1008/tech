const Role = require("../models/Role");

const checkPermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.roleId; // JWT se

      const role = await Role.findById(roleId).populate(
        "permissions.module",
        "name"
      );

      if (!role) return res.status(403).json({ message: "Role not found" });

      const permission = role.permissions.find(
        (p) => p.module.name === moduleName
      );

      if (!permission)
        return res.status(403).json({ message: "Permission not assigned" });

      if (permission.all || permission[action]) return next();

      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = checkPermission;