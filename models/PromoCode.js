const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  discount: {
    type: Number,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
  },
  expiryDate: {
    type: String,
  },
  usageLimit: {
    type: Number,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const PromoCode = mongoose.model("PromoCode", PromoCodeSchema);
module.exports = PromoCode;
