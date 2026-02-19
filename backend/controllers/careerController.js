const Career = require("../models/Career");

exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ title: 1 });
    res.json(careers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createCareer = async (req, res) => {
  const { title, location, type, stack } = req.body;

  try {
    const career = new Career({ title, location, type, stack });
    await career.save();
    res.status(201).json(career);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update career
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete career
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json({ message: "Career deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
