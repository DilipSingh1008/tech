const { State, City } = require("../models/location.js");

exports.getStates = async (req, res) => {
  try {
    const states = await State.find();
    res.status(200).json(states);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getStatesByCountryId = async (req, res) => {
  try {
    const { countryId } = req.params;

    if (!countryId) {
      return res.status(400).json({ message: "Country ID is required" });
    }

    // ⭐ query params
    let { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } =
      req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    // ⭐ total count
    const total = await State.countDocuments({ country: countryId });

    // ⭐ data fetch
    const states = await State.find({ country: countryId })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    if (!states || states.length === 0) {
      return res
        .status(404)
        .json({ message: "No states found for the given country ID" });
    }

    return res.status(200).json({
      data: states,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createStateLocation = async (req, res) => {
  try {
    const { state } = req.body;
    const { countryId } = req.params;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    if (!countryId) {
      return res.status(400).json({ message: "Country ID is required" });
    }

    const newState = await State.create({ name: state, country: countryId });

    res
      .status(201)
      .json({ message: "State created successfully", state: newState });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};

exports.editStateName = async (req, res) => {
  try {
    const { state } = req.body;

    const { id } = req.params;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    const existingState = await State.findById(id);

    if (!existingState) {
      return res.status(404).json({ message: "State not found" });
    }

    const updatedState = await State.findByIdAndUpdate(
      id,
      { name: state },
      { new: true },
    );

    res.status(200).json({
      message: "State updated successfully",
      state: updatedState,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteStates = async (req, res) => {
  try {
    const { id } = req.params;

    const existingState = await State.findById(id);

    if (!existingState) {
      return res.status(404).json({ message: "State not found" });
    }

    // ✅ Delete all cities of this state
    await City.deleteMany({ state: id });

    // ✅ Delete state
    await State.findByIdAndDelete(id);

    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.toggleStateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingState = await State.findById(id);

    if (!existingState) {
      return res.status(404).json({ message: "State not found" });
    }

    // ⭐ toggle
    existingState.status = !existingState.status;
    await existingState.save();

    res.status(200).json({
      message: "State status updated successfully",
      state: existingState,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};