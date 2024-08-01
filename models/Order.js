const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderNumber: { type: String, unique: true },
    sessionkey: { type: String, unique: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    checkoutAmount: {
      subtotal: { type: Number },
      discountedAmount: { type: Number },
      deliveryFee: { type: Number },
      total: { type: Number },
      totalProfit: { type: Number },
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
