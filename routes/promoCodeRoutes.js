const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');

router.get('/all', promoCodeController.getAllPromoCodes);

// Validate promo code
router.post('/validate', promoCodeController.validatePromoCode);

// Create a new promo code (for admin purposes)
router.post('/create', promoCodeController.createPromoCode);

// Delete a promo code (for admin purposes)
router.delete('/delete', promoCodeController.deletePromoCode);

module.exports = router;
