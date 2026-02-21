const { Country, State, City } = require("../models/location.js");

exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createCountryLocation = async (req, res) => {
  try {
    const { country } = req.body;

    if (!country) {
      return res.status(400).json({ message: "Country is required" });
    }

    const newCountry = await Country.create({ name: country });

    res
      .status(201)
      .json({ message: "Country created successfully", country: newCountry });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};

exports.editCountryName = async (req, res) => {
  try {
    const { country } = req.body;

    const { id } = req.params;

    if (!country) {
      return res.status(400).json({ message: "Country is required" });
    }

    const existingCountry = await Country.findById(id);

    if (!existingCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { name: country },
      { new: true },
    );

    res
      .status(200)
      .json({
        message: "Country updated successfully",
        country: updatedCountry,
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCountry = await Country.findById(id);

    const associatedStates = await State.find({country: id});

    const associatedCities = await City.find({country: id});

    if (!existingCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    await City.deleteMany({state: {$in: associatedStates.map(state => state._id)}})

    await State.deleteMany({country: id})

    await Country.findByIdAndDelete(id);

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};
