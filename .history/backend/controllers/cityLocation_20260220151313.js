const { City } = require("../models/location.js");

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

exports.createCityLocation = async (req, res) => {
  try {
    const { city } = req.body;
    const { stateId } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    if (!stateId) {
      return res.status(400).json({ message: "State ID is required" });
    }

    const newCity = await City.create({ name: city, state: stateId });

    res
      .status(201)
      .json({ message: "City created successfully", city: newCity });
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

    await State.findByIdAndDelete(id);

    res.status(200).json({ message: "State  deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};
