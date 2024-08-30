const express = require("express");
const router = express.Router();
const deliveryFeeController = require("../controllers/deliveryFeeController");

router.get("/all", deliveryFeeController.getAllDeliveryFees);
router.post("/createOrUpdate", deliveryFeeController.createOrUpdateDeliveryFee);
router.delete("/delete", deliveryFeeController.deleteDeliveryFee);

module.exports = router;
