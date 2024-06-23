const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  role: {
    type: String,
    enum: ["Admin", "Manager", "User"],
    default: "User",
  },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  phone: { type: String },
  address: { type: String },
  prescription: { type: String }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
