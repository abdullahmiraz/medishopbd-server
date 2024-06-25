const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/uid/:uid", userController.getMongoIdByUid); // firebase uid fetch by this route
router.get("/:userId/orders", userController.getOrdersByUserId); // New route

router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id", userController.updateUserDetails); // update user details(phone, address etc)

router.delete("/:id", userController.deleteUser);

module.exports = router;
