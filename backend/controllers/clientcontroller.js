const Client = require("../models/client");
const { Country, State, City } = require("../models/location");
const mongoose = require("mongoose");

// ================= ADD CLIENT =================

exports.addClient = async (req, res) => {
  try {
    const { name, email, mobile, country, state, city } = req.body;

    // ✅ Basic validation
    if (!name || !email || !mobile || !country || !state || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ ObjectId validation
    if (
      !mongoose.Types.ObjectId.isValid(country) ||
      !mongoose.Types.ObjectId.isValid(state) ||
      !mongoose.Types.ObjectId.isValid(city)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid location IDs",
      });
    }

    // ✅ Check country exists
    const countryExists = await Country.findOne({ _id: country, status: true });
    if (!countryExists) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    // ✅ Check state belongs to country
    const stateExists = await State.findOne({
      _id: state,
      country: country,
      status: true,
    });

    if (!stateExists) {
      return res.status(404).json({
        success: false,
        message: "State not valid for selected country",
      });
    }

    // ✅ Check city belongs to state
    const cityExists = await City.findOne({
      _id: city,
      state: state,
      status: true,
    });

    if (!cityExists) {
      return res.status(404).json({
        success: false,
        message: "City not valid for selected state",
      });
    }

    // ✅ Duplicate email check
    const existingEmail = await Client.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // ✅ Mobile validation (10 digit)
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }

    const client = await Client.create({
      name,
      email: email.toLowerCase(),
      mobile,
      country,
      state,
      city,
    });

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET ALL CLIENTS =================

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ status: true })
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= UPDATE CLIENT =================

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Client.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= DELETE CLIENT (SOFT DELETE) =================

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Client.findByIdAndUpdate(
      id,
      { status: false },
      { new: true },
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
