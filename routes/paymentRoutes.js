const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/initiate", paymentController.createOrder);
router.get("/", paymentController.getAllOrders);
router.get("/success/:tranId", paymentController.successPayment);
router.get("/fail/:tranId", paymentController.failPayment);
router.get("/orders/:phone", paymentController.getOrders);

module.exports = router;
