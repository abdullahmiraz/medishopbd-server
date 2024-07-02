// controllers/promoCodeController.js
const PromoCode = require("../models/PromoCode");

// Get all promo codes
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({});
    res.json(promoCodes);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Validate promo code
exports.validatePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res.status(400).json({ message: "Invalid promo code." });
    }

    if (promoCode.disabled) {
      return res.status(400).json({ message: "Promo code is disabled." });
    }

    if (promoCode.expiryDate < Date.now()) {
      return res.status(400).json({ message: "Promo code has expired." });
    }

    if (promoCode.usageCount >= promoCode.usageLimit) {
      return res
        .status(400)
        .json({ message: "Promo code usage limit exceeded." });
    }

    // Apply discount logic
    let discount;
    if (promoCode.discountType === "percentage") {
      discount = promoCode.discount;
    } else {
      discount = promoCode.discount;
    }

    // Increment usage count
    await PromoCode.findOneAndUpdate(
      { code: promoCode.code },
      { $inc: { usageCount: 1 } }
    );

    res.json({ discount, discountType: promoCode.discountType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// Create a new promo code
exports.createPromoCode = async (req, res) => {
  const { code, discount, discountType, expiryDate, usageLimit } = req.body;
  console.log(req.body);

  try {
    const newPromoCode = new PromoCode({
      code,
      discount,
      discountType,
      expiryDate,
      usageLimit,
    });

    await newPromoCode.save();
    res.status(201).json({ message: "Promo code created successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Delete a promo code
exports.deletePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const deletedPromoCode = await PromoCode.findOneAndDelete({ code });

    if (!deletedPromoCode) {
      return res.status(404).json({ message: "Promo code not found." });
    }

    res.json({ message: "Promo code deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Enable or disable a promo code
exports.togglePromoCodeStatus = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found." });
    }

    promoCode.disabled = !promoCode.disabled;
    await promoCode.save();

    res.json({
      message: `Promo code ${
        promoCode.disabled ? "disabled" : "enabled"
      } successfully.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
