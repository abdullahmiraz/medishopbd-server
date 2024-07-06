const Product = require("../models/Product");

// Get all products with populated primaryCategory and subCategory
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('primaryCategory.id', 'name description categoryImage categoryCode') // Populate Category fields
      .populate('subCategory.id', 'name description categoryImage subCategoryCode'); // Populate SubCategory fields
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a product by ID with populated primaryCategory and subCategory
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('primaryCategory.id', 'name description categoryImage categoryCode') // Populate Category fields
      .populate('subCategory.id', 'name description categoryImage subCategoryCode'); // Populate SubCategory fields

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

    // Check if availableStock is valid
    if (req.body.availableStock < 0) {
      return res.status(400).json({ message: "Available stock cannot be negative" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('primaryCategory.id', 'name description categoryImage categoryCode') // Populate Category fields
      .populate('subCategory.id', 'name description categoryImage subCategoryCode'); // Populate SubCategory fields

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
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
