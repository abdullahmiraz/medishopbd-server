import { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    data: {
      _id: { type: Schema.Types.ObjectId, ref: "Order" },
      name: { type: String },
      recipe: { type: String },
      image: { type: String },
      category: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentStatus: { type: Boolean, required: true },
    tranId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
