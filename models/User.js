const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["Admin", "Manager", "Customer"],
    default: "Customer",
  },
  name: { type: String },
  email: { type: String },

  photoURL: { type: String },
  phone: { type: String, unique: true },
  password: { type: String },
  address: { type: String },
  prescription: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
