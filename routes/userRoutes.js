const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const { checkUser } = require("../middleware/checkUser");

// Authentication routes
router.post("/login", userController.loginUser); // Login route
router.post("/signup", userController.createUser); // Signup route with middleware

// User management routes
router.get("/", userController.getAllUsers); // Get all users
router.get("/:id", userController.getUserById); // Get user by ID
router.get("/orders/:userId", userController.getOrdersByUserId); // Get orders by user ID

router.post("/", userController.createUserByEmail); // Create user by email
router.put("/:id", userController.updateUser); // Update user by ID
router.patch("/:id", userController.updateUserDetails); // Update user details (phone, address, etc.) by ID

router.delete("/:id", userController.deleteUser); // Delete user by ID

module.exports = router;
