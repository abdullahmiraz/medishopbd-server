const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/initiate", paymentController.createOrder);
router.get("/", paymentController.getAllPaymentDetails);
router.get("/success/:tranId", paymentController.successPayment);
router.get("/fail/:tranId", paymentController.failPayment);
router.get("/orders/:phone", paymentController.getPaymentDetailsByPhone);

module.exports = router;
