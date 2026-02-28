const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Admin", "SuperAdmin"],
      default: "Admin",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },


    phone: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);



// 🔥 password hash
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});



// 🔥 compare password
adminSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  console.log("Password Match:", password, " ", this.password);
  return isMatch;
};

module.exports = mongoose.model("Admin", adminSchema);