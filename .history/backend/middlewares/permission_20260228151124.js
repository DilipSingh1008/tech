const Role = require("../models/Role");

const checkPermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {

      console.log("AAAAAAAAA")

      console.log(req.user.role )

      if(req.user.role === "admin") return next()

      const roleId = req.user.roleId; // JWT se

      console.log("BBBBBBBBBB")
      console.log(roleId)

      const role = await Role.findById(roleId).populate(
        "permissions.module",
        "name"
      );

      console.log(role)

      if (!role) return res.status(403).json({ message: "Role not found" });

      console.log("role", role)

      const permission = role.permissions.find(
        (p) => p.module.name === moduleName
      );

      if (!permission)
        return res.status(403).json({ message: "Permission not assigned" });

      if (permission.all || permission[action]) return next();


      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = checkPermission;