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

    const states = await State.find({ country: countryId });

    if(!states || states.length === 0) {
       return res.status(404).json({ message: "No states found for the given country ID" });
    }
   return res.status(200).json(states);
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
