const Role = require("../models/Role");
const Module = require("../models/module");
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Role.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      status: true,
    });

    res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";   // ← add
    const order = req.query.order || "desc";           // ← add

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const total = await Role.countDocuments(query);

    const roles = await Role.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })   // ← dynamic, moved before skip
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: roles,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateRole = async (req, res) => {
  try {
    const { name, status } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (name) role.name = name.toLowerCase();
    if (status !== undefined) role.status = status;

    await role.save();

    res.json({
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.deleteOne();

    res.json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // ⭐ all checkbox sync
    const formattedPermissions = permissions.map((p) => {
      if (p.all) {
        return {
          ...p,
          view: true,
          add: true,
          edit: true,
          delete: true,
        };
      }
      return p;
    });

    role.permissions = formattedPermissions;
    await role.save();

    res.json({
      message: "Permissions updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPermissions = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).select("permissions name");

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find({ status: true }).sort({ order: 1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};