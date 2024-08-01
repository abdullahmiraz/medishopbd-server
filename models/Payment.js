const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    sessionkey: { type: String },
    orderNumber: { type: String, unique: true },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    paymentStatus: { type: Boolean },
    tranId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
