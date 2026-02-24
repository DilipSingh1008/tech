import Service from "../models/Service.js";

// Create new service
export const createService = async (req, res) => {
  try {
    const { name, slug, shortDescription, description, status } = req.body;

    if (!name || !shortDescription || !slug) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check slug uniqueness
    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const service = new Service({
      name,
      slug,
      shortDescription,
      description,
      status: status !== undefined ? status : true,
    });

    if (req.files?.featuredImage) {
      service.featuredImage = req.files.featuredImage[0].filename;
    }

    await service.save();

    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
