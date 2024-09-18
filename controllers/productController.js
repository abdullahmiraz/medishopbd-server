const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body); // Directly use the request body data

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if quantity in stockDetails is valid
    if (
      req.body.stockDetails &&
      req.body.stockDetails.some((stock) => stock.quantity < 0)
    ) {
      return res
        .status(400)
        .json({ message: "Quantity in stockDetails cannot be negative" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProductStock = async (req, res) => {
  try {
    const { productId, quantityToDeduct } = req.body;

    console.log("Received request to update stock for product ID:", productId);
    console.log("Quantity to Deduct:", quantityToDeduct);

    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stockDetails.length === 0) {
      return res
        .status(400)
        .json({ message: "No stock available for this product" });
    }

    let remainingQuantity = quantityToDeduct;
    let updatedStockDetails = [];

    // Deduct quantity from stockDetails
    for (
      let i = 0;
      i < product.stockDetails.length && remainingQuantity > 0;
      i++
    ) {
      const stock = product.stockDetails[i];

      if (stock.quantity > 0) {
        if (stock.quantity >= remainingQuantity) {
          stock.quantity -= remainingQuantity;
          remainingQuantity = 0;
        } else {
          remainingQuantity -= stock.quantity;
          stock.quantity = 0;
        }
      }

      // Only include stock entries with remaining quantity
      if (stock.quantity > 0) {
        updatedStockDetails.push(stock);
      }
    }

    if (remainingQuantity > 0) {
      return res.status(400).json({ message: "Insufficient stock to deduct" });
    }

    // Update the product with new stock details
    const result = await Product.updateOne(
      { _id: productId },
      { $set: { stockDetails: updatedStockDetails } }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update stock" });
    }

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
