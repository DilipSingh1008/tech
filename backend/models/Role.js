// const mongoose = require("mongoose");

// const roleSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },

//     status: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Role", roleSchema);



const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    permissions: [
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    all: { type: Boolean, default: false },
  },
]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
