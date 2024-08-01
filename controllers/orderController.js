const Order = require("../models/Order");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new order

// Create a new order
exports.createOrder = async (req, res) => {
  const {
    userId,
    orderNumber,
    products,
    deliveryFee,
    checkoutAmount,
    status = "Pending",
  } = req.body;

  // Validate the request body
  if (!userId || !products || !checkoutAmount) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  try {
    // Check if order number already exists
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      // Skip creating the order if it already exists
      console.log(
        "Order number already exists, skipping creation.",
        orderNumber
      );
      return res.status(400).json({ message: "Order number already exists." });
    }

    // Create the order
    const order = new Order({
      userId,
      orderNumber,
      products,
      deliveryFee,
      checkoutAmount,
      status,
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    // Handle duplicate key errors and other potential errors
    if (err.code === 11000) {
      // Duplicate key error
      console.error("Duplicate key error:", err.message);
      res.status(400).json({ message: "Duplicate key error." });
    } else {
      console.error("Error creating order:", err.message);
      res.status(500).json({ message: "Failed to create order." });
    }
  }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order fields with the request body
    Object.keys(req.body).forEach((key) => {
      order[key] = req.body[key];
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
