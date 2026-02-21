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

exports.getCityByStateId = async (req, res) => {
  try {
    const { stateId } = req.params;

    if (!stateId) {
      return res.status(400).json({ message: "State ID is required" });
    }

    const cities = await City.find({ state: stateId });

    if(!cities || cities.length === 0) {
       return res.status(404).json({ message: "No cities found for the given state ID" });
    }
   return res.status(200).json(cities);
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

exports.editCityName = async (req, res) => {
  try {
    const { city } = req.body;

    const { cityId } = req.params;

    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }

    const existingCity = await City.findById(cityId);

    if (!existingCity) {
      return res.status(404).json({ message: "City not found" });
    }

    const updatedCity = await City.findByIdAndUpdate(
      cityId,
      { name: city },
      { new: true },
    );

    res.status(200).json({
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};

exports.deletecity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const existingCity = await City.findById(cityId);

    if (!existingCity) {
      return res.status(404).json({ message: "City not found" });
    }

    await City.findByIdAndDelete(cityId);

    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};
