const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  role: {
    type: String,
    enum: ["Admin", "Manager", "User"],
    default: "User",
  },
  name: { type: String },
  email: { type: String, unique: true, default: "" },
  photoURL: { type: String },
  phone: { type: String, unique: true },
  password: { type: String },
  address: { type: String },
  prescription: { type: String },
});

// Pre-save hook to generate UID if not provided
userSchema.pre("save", function (next) {
  if (!this.uid) {
    this.uid = uuidv4();
    this.email = uuidv4();
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
