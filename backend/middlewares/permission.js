const Role = require("../models/Role");
const User = require("../models/User");

const checkPermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === "admin") return next();

      const [role, user] = await Promise.all([
        Role.findById(req.user.roleId).populate("permissions.module", "name"),
        User.findById(req.user.id).populate("permissions.module", "name"),
      ]);

      if (!role) return res.status(403).json({ message: "Role not found" });
      if (!user) return res.status(403).json({ message: "User not found" });

      const rolePerm = role.permissions.find((p) => p.module?.name === moduleName);
      const userPerm = user.permissions.find((p) => p.module?.name === moduleName);

      if (!rolePerm && !userPerm) {
        return res.status(403).json({ message: "Permission not assigned" });
      }

      const effective = {
        all: !!rolePerm?.all || !!userPerm?.all,
        view: !!rolePerm?.view || !!userPerm?.view,
        add: !!rolePerm?.add || !!userPerm?.add,
        edit: !!rolePerm?.edit || !!userPerm?.edit,
        delete: !!rolePerm?.delete || !!userPerm?.delete,
      };

      if (effective.all || effective[action]) return next();

      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = checkPermission;
