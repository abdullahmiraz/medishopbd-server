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
exports.createOrder = async (req, res) => {
  const { userId, products, total } = req.body;

  // Validate the request body
  if (!userId || !products || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create the order
  const order = new Order({
    userId,
    products,
    total,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
