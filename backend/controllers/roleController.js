const Role = require("../models/Role");
const Module = require("../models/module");

const SIDEBAR_MODULES = [
  { name: "dashboard", label: "Dashboard", order: 1 },
  { name: "managerole", label: "ManageRole", order: 2 },
  { name: "users", label: "Users", order: 3 },
  { name: "location", label: "Location", order: 4 },
  { name: "categories", label: "Categories", order: 5 },
  { name: "banner", label: "Banner", order: 6 },
  { name: "products", label: "Products", order: 7 },
  { name: "services", label: "Services", order: 8 },
  { name: "cms", label: "CMS", order: 9 },
  { name: "faq-category", label: "FAQ Category", order: 10 },
  { name: "faq", label: "FAQ", order: 11 },
  { name: "news", label: "News", order: 12 },
  { name: "blog-category", label: "Blog Category", order: 13 },
  { name: "blog", label: "Blog", order: 14 },
  { name: "client", label: "Client", order: 15 },
  { name: "enquiry", label: "Enquiry", order: 16 },
  { name: "vendor", label: "Vendor", order: 17 },
  { name: "career", label: "Career", order: 18 },
  { name: "media-post", label: "MediaPost", order: 19 },
  { name: "settings", label: "Settings", order: 20 },
];

const syncSidebarModules = async () => {
  const operations = SIDEBAR_MODULES.map((mod) => ({
    updateOne: {
      filter: { name: mod.name },
      update: {
        $set: {
          label: mod.label,
          order: mod.order,
          status: true,
        },
        $setOnInsert: {
          view: true,
          add: true,
          edit: true,
          delete: true,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length) {
    await Module.bulkWrite(operations, { ordered: false });
  }
};

const normalizeModuleName = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

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
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";

    const query = {
      isDeleted: false,
      name: { $regex: search, $options: "i" },
    };

    const total = await Role.countDocuments(query);

    const roles = await Role.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
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

    // await role.deleteOne();
    role.isDeleted = true;
    await role.save();

    res.json({
      message: "Role deleted successfully",
      data: role,
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

    const formattedPermissions = permissions.map((p) => ({
      module: p.module, // ⭐ ObjectId aa raha
      view: p.all ? true : p.view,
      add: p.all ? true : p.add,
      edit: p.all ? true : p.edit,
      delete: p.all ? true : p.delete,
      all: p.all,
    }));

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
    //  console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
    const role = await Role.findById(req.params.id).populate(
      "permissions.module",
      "name label",
    );

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json({
      name: role.name,
      permissions: role.permissions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getModules = async (req, res) => {
  try {
    await syncSidebarModules();
    const modules = await Module.find({ status: true }).sort({ order: 1, label: 1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllModules = async (req, res) => {
  try {
    await syncSidebarModules();
    const modules = await Module.find().sort({ order: 1, label: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { name, label, icon = "", order, view, add, edit, delete: remove } = req.body;
    if (!label) {
      return res.status(400).json({ message: "Label is required" });
    }

    const normalizedName = normalizeModuleName(name || label);
    if (!normalizedName) {
      return res.status(400).json({ message: "Valid module name is required" });
    }

    const exists = await Module.findOne({ name: normalizedName });
    if (exists) {
      return res.status(400).json({ message: "Module already exists" });
    }

    const moduleItem = await Module.create({
      name: normalizedName,
      label: label.trim(),
      icon,
      order: Number(order) || 999,
      status: true,
      view: view !== undefined ? !!view : true,
      add: add !== undefined ? !!add : true,
      edit: edit !== undefined ? !!edit : true,
      delete: remove !== undefined ? !!remove : true,
    });

    res.status(201).json({
      message: "Module created successfully",
      data: moduleItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { label, order, status, icon, view, add, edit, delete: remove } = req.body;
    const moduleItem = await Module.findById(req.params.id);
    if (!moduleItem) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (label !== undefined) moduleItem.label = label.trim();
    if (order !== undefined) moduleItem.order = Number(order) || 0;
    if (status !== undefined) moduleItem.status = !!status;
    if (icon !== undefined) moduleItem.icon = icon;
    if (view !== undefined) moduleItem.view = !!view;
    if (add !== undefined) moduleItem.add = !!add;
    if (edit !== undefined) moduleItem.edit = !!edit;
    if (remove !== undefined) moduleItem.delete = !!remove;

    await moduleItem.save();

    res.json({
      message: "Module updated successfully",
      data: moduleItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const moduleItem = await Module.findById(req.params.id);
    if (!moduleItem) {
      return res.status(404).json({ message: "Module not found" });
    }

    moduleItem.status = false;
    await moduleItem.save();

    res.json({
      message: "Module disabled successfully",
      data: moduleItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
