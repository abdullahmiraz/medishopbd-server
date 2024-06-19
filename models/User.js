const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
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
