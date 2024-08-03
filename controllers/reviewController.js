// controllers/reviewController.js

const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, userId, name, rating, comment } = req.body;

    // Validate product and user existence
    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const review = new Review({
      productId,
      userId,
      name,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "username") // Populate the username of the user who wrote the review
      .sort({ createdAt: -1 }); // Sort reviews by most recent first

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
// Get reviews for a specific product
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
