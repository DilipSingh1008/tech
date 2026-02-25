const { Country, State, City } = require("../models/location.js");

exports.getCountries = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    //  sorting
    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    //  search filter
    const searchFilter = {
      name: { $regex: search, $options: "i" }, // case insensitive search
    };

    //  total count with search
    const total = await Country.countDocuments(searchFilter);

    //  data
    const countries = await Country.find(searchFilter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: countries,
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


exports.toggleCountryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // console.log("hii")
    const existingCountry = await Country.findById(id);

    if (!existingCountry) {
      return res.status(404).json({ message: "Country not found" });
    }



    //  toggle logic
    existingCountry.status = !existingCountry.status;

    await existingCountry.save();

    console.log("Toggled status for country:", existingCountry.name, "New status:", existingCountry.status);

    res.status(200).json({
      message: "Country status updated",
      status: existingCountry.status,
      country: existingCountry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};