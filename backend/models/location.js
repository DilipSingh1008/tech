const mongoose = require("mongoose");


// ✅ Country Schema
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  }
}, {timestamps: true});
const Country = mongoose.model("Country", countrySchema);


// ✅ State Schema
const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true
  },
   status: {
    type: Boolean,
    default: true
  }
}, {timestamps: true}
);
const State = mongoose.model("State", stateSchema);


// ✅ City Schema
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true
  },
   status: {
    type: Boolean,
    default: true
  }
}, {timestamps: true}
);
const City = mongoose.model("City", citySchema);


// ⭐ Export all models
module.exports = {
  Country,
  State,
  City
};