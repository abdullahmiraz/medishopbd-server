const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
require("dotenv").config();

const store_id = process.env.SSL_ID;
const store_passwd = process.env.SSL_PWD;
const is_live = false;

exports.createOrder = async (req, res) => {
  const { checkoutAmount, orderNumber, name, phone, address } = req?.body;
  const tranId = new mongoose.Types.ObjectId().toString();
  const data = {
    total_amount: checkoutAmount?.total,
    currency: "BDT",
    tran_id: tranId,
    orderNumber: orderNumber,
    success_url: "http://localhost:3000/checkout/confirmation",
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
    cus_phone: phone,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  console.log(data);

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then(async (apiResponse) => {
    console.log(apiResponse);
    const { GatewayPageURL, sessionkey, tran_id } = apiResponse;

    const payment = new Payment({
      sessionkey,
      orderNumber: orderNumber,
      name,
      phone,
      address,
      paymentStatus: false,
    });

    try {
      res.send({ url: GatewayPageURL }); // Send the response
      await payment.save();
      console.log("GatewayPageURL: ", GatewayPageURL, sessionkey, tran_id); // Log the success
    } catch (error) {
      console.error("Error saving payment:", error); // Log the error for debugging
      // res.status(500).send("Failed to save payment details."); // Send an error response
    }
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
      res.redirect(`http://localhost:3000/payments/success/${tranId}`);
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
    res.status(200).json({
      success: true,
      message: "Successfully loaded data",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to load data",
    });
  }
};
