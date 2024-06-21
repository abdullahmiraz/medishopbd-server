const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // firebase UID
  name: { type: String },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  phone: { type: String },
  address: { type: String },
  prescription: { type: String },
  orders: [
    {
      orderId: String,
      date: Date,
      total: Number,
      status: String,
      items: [
        {
          id: Number,
          name: String,
          quantity: Number,
          price: Number,
        },
      ],
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
