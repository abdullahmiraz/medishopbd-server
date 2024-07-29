const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Check if the user already exists with the same phone number
    let existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this phone number already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    let newUser = new User({ phone, password: hashedPassword });

    // Save the new user
    await newUser.save();

    // Return the newly created user object in the response
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // You can generate and send a JWT token here if needed
    res
      .status(200)
      .json({ message: "Login successful", userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// updated
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUserByEmail = async (req, res) => {
  const { email, ...userData } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists." });
    }

    user = new User({ email, ...userData });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.prescription = req.body.prescription || user.prescription;
    user.orders = req.body.orders || user.orders;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: err.message });
  }
};
