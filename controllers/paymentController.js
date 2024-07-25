const SSLCommerzPayment = require("sslcommerz-lts");
const mongoose = require("mongoose");
require("dotenv").config();

const store_id = process.env.SSL_ID;
const store_passwd = process.env.SSL_PWD;
const is_live = false;

const tranId = new mongoose.Types.ObjectId().toString();
exports.createOrder = async (req, res) => {
  const { checkoutAmount, orderNumber } = req.body;

  const data = {
    total_amount: checkoutAmount?.total,
    currency: "BDT",
    orderNumber: orderNumber,
    tran_id: tranId, // use unique tran_id for each api call
    success_url: `http://localhost:3000/payments/success/${tranId}`,
    fail_url: "http://localhost:3000/payments/fail",
    cancel_url: "http://localhost:3000/payments/cancel",
    ipn_url: "http://localhost:3000/payments/ipn",
    shipping_method: "Courier",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
  };
  console.log(data);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    // res.redirect(GatewayPageURL);
    res.send({ url: GatewayPageURL });
    console.log("Redirecting to: ", GatewayPageURL);
  });
};

//   const { order, price, name, phone, address } = req.body;

//   const tranId = new mongoose.Types.ObjectId().toString();

//   const orderData = order.map((item) => {
//     return {
//       ...item,
//       name,
//       phone,
//       address,
//       paymentStatus: false,
//       tranId,
//     };
//   });

//   const data = {
//     total_amount: price,
//     currency: "BDT",
//     tran_id: tranId,
//     success_url: http://localhost:${process.env.PORT}/payment,
//     fail_url: http://localhost:${process.env.PORT}/payment/fail/${tranId},
//     cancel_url: http://localhost:${process.env.FRONTEND}/cancel,
//     ipn_url: http://localhost:${process.env.FRONTEND}/ipn,
//     shipping_method: "Courier",
//     product_name: "Computer.",
//     product_category: "Electronic",
//     product_profile: "general",
//     cus_name: name,
//     cus_email: "customer@example.com",
//     cus_add1: "Dhaka",
//     cus_add2: "Dhaka",
//     cus_city: "Dhaka",
//     cus_state: "Dhaka",
//     cus_postcode: "1000",
//     cus_country: "Bangladesh",
//     cus_phone: phone,
//     cus_fax: "01711111111",
//     ship_name: name,
//     ship_add1: address,
//     ship_add2: "Dhaka",
//     ship_city: "Dhaka",
//     ship_state: "Dhaka",
//     ship_postcode: 1000,
//     ship_country: "Bangladesh",
//   };

//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//   sslcz.init(data).then(async (apiResponse) => {
//     const GatewayPageURL = apiResponse.GatewayPageURL;
//     res.send({ url: GatewayPageURL });
//     await orderService.createOrderForDatabase(orderData);
//   });
// };

exports.successPayment = async (req, res) => {
  const { tranId } = req.params;

  const result = await orderService.updateOrderFromDatabase(tranId);
  if (result.modifiedCount > 0) {
    res.redirect(`http://localhost:3000/payments/success/${tranId}`);
  }
};

exports.failPayment = async (req, res) => {
  const { tranId } = req.params;

  const result = await orderService.deleteOrderFromDatabase(tranId);
  if (result.deletedCount) {
    res.redirect(`http://localhost:3000/payments/fail/${tranId}`);
  }
};

exports.getOrders = async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await orderService.getSingleOrderFromDatabase(phone);
    res.status(200).json({
      success: true,
      message: "Successfully load data",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to load data",
    });
  }
};
