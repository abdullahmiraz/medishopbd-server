const DeliveryFee = require("../models/DeliveryFee");

// Get all delivery fees
exports.getAllDeliveryFees = async (req, res) => {
  try {
    const deliveryFees = await DeliveryFee.find({});
    res.json(deliveryFees);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Create or update delivery fee for a division
exports.createOrUpdateDeliveryFee = async (req, res) => {
  const { division, fee } = req.body;

  try {
    const updatedFee = await DeliveryFee.findOneAndUpdate(
      { division },
      { fee },
      { new: true, upsert: true }
    );
    res.json(updatedFee);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Delete a delivery fee
exports.deleteDeliveryFee = async (req, res) => {
  const { division } = req.body;

  try {
    const deletedFee = await DeliveryFee.findOneAndDelete({ division });
    if (!deletedFee) {
      return res.status(404).json({ message: "Delivery fee not found." });
    }
    res.json({ message: "Delivery fee deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
