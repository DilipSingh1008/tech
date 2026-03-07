const Client = require("../models/client");
const { Country, State, City } = require("../models/location");
const mongoose = require("mongoose");

exports.addClient = async (req, res) => {
  try {
    const { name, email, mobile, country, state, city } = req.body;

    if (!name || !email || !mobile || !country || !state || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

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

    const countryExists = await Country.findOne({ _id: country, status: true });
    if (!countryExists) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

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

    const existingEmail = await Client.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

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

exports.getClients = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortField = "name",
      sortOrder = "asc",
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = { status: true, isDeleted: false };
    if (search) {
      // Search by name, email or mobile
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Client.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const clients = await Client.find(query)
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name")
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

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

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (client.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Client is already deleted",
      });
    }

    client.isDeleted = true;
    await client.save();

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

exports.toggleClientStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    client.status = !client.status;
    await client.save();

    return res.status(200).json({
      success: true,
      message: "Client status updated",
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
