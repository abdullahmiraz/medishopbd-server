const mongoose = require("mongoose");

const DeliveryFeeSchema = new mongoose.Schema({
  division: {
    type: String,
    unique: true,
  },
  fee: {
    type: Number,
  },
});

const DeliveryFee = mongoose.model("DeliveryFee", DeliveryFeeSchema);
module.exports = DeliveryFee;
