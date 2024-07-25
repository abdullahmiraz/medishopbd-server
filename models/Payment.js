const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    orderNumber: { type: String },
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
