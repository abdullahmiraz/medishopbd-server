const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
require("dotenv").config();

const store_id = process.env.SSL_ID;
const store_passwd = process.env.SSL_PWD;
const is_live = false;

const tranId = new mongoose.Types.ObjectId().toString();

exports.createOrder = async (req, res) => {
  const {
    userId,
    orderNumber,
    name,
    phone,
    address,
    products,
    checkoutAmount,
  } = req.body;
  const data = {
    total_amount: checkoutAmount.total,
    currency: "BDT",
    tran_id: tranId,
    orderNumber: orderNumber,
    // success_url: `http://localhost:3000/checkout/confirmation`,
    success_url: `http://localhost:3000/checkout/sslpay/success/?oid=${orderNumber}`,
    fail_url: "http://localhost:3000/fail",
    cancel_url: "http://localhost:3000/cancel",
    ipn_url: "http://localhost:3000/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: name,
    cus_email: "customer@example.com",
    cus_add1: address,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: phone || "015388888888",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz
    .init(data)
    .then(async (apiResponse) => {
      const { GatewayPageURL, sessionkey } = apiResponse;

      const payment = new Payment({
        sessionkey,
        orderNumber: orderNumber,
        name,
        phone,
        address,
        paymentStatus: false,
      });

      try {
        await payment.save();
        console.log("Payment saved successfully.");
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key error
          console.warn(
            "Duplicate orderNumber detected, skipping save:",
            error.message
          );
        } else {
          // Log other errors
          console.error("Error saving payment:", error);
        }
      } finally {
        // Send response regardless of whether saving was successful or not
        res.send({ url: GatewayPageURL, sessionkey });
      }
    })
    .catch((error) => {
      console.error("SSLCommerz initialization error:", error);
      res.status(500).send("Failed to initialize payment.");
    });
};

exports.successPayment = async (req, res) => {
  const { tranId } = req.params;
  try {
    const payment = await Payment.findOneAndUpdate(
      { tranId },
      { paymentStatus: true }
    );
    if (payment) {
      res.redirect(
        `http://localhost:3000/checkout/sslpay/success/${orderNumber}`
      );
    } else {
      res.status(404).send("Payment not found.");
    }
  } catch (error) {
    res.status(500).send("Failed to update payment status.");
  }
};

exports.failPayment = async (req, res) => {
  const { tranId } = req.params;
  try {
    const result = await Payment.findOneAndDelete({ tranId });
    if (result) {
      res.redirect(`http://localhost:3000/payments/fail/${tranId}`);
    } else {
      res.status(404).send("Payment not found.");
    }
  } catch (error) {
    res.status(500).send("Failed to delete payment.");
  }
};

exports.getOrders = async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await Payment.find({ phone });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to load data",
    });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const result = await Payment.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to load data",
    });
  }
};
