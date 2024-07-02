const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); //.sort({ productId: 1 }).exec();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

exports.createProduct = async (req, res) => {
  try {
    const { primaryCategory, subCategory, ...rest } = req.body;

    if (!primaryCategory?.id || !primaryCategory?.name) {
      return res
        .status(400)
        .json({ message: "Primary Category must have id and name" });
    }

    if (!subCategory?.id || !subCategory?.name) {
      return res
        .status(400)
        .json({ message: "Sub Category must have id and name" });
    }

    const newProduct = new Product({
      ...rest,
      primaryCategory: {
        id: primaryCategory.id,
        name: primaryCategory.name,
      },
      subCategory: {
        id: subCategory.id,
        name: subCategory.name,
      },
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the updateData contains availableStock and validate it
    if (
      updateData.availableStock !== undefined &&
      updateData.availableStock < 0
    ) {
      return res
        .status(400)
        .json({ message: "Available stock cannot be negative" });
    }

    // Handle primaryCategory and subCategory fields
    if (updateData.primaryCategory) {
      updateData.primaryCategory = {
        id: updateData.primaryCategory.id,
        name: updateData.primaryCategory.name,
      };
    }

    if (updateData.subCategory) {
      updateData.subCategory = {
        id: updateData.subCategory.id,
        name: updateData.subCategory.name,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.params.id;
    const product = await Product.findByIdAndDelete(userId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
