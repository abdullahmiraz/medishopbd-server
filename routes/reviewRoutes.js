// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a new review
router.post("/", reviewController.createReview);

// Update a review
router.patch("/:reviewId", reviewController.updateReview);

// Delete a review
router.delete("/:reviewId", reviewController.deleteReview);

// Get reviews for a specific product
router.get("/product/:productId", reviewController.getReviewsByProduct);
router.get("/", reviewController.getAllReviews);

module.exports = router;
