// const User = require("../models/User");

// exports.checkUser = async (req, res, next) => {
//   const { phone } = req.body;

//   try {
//     const user = await User.findOne({ phone });
//     console.log(phone)
//     console.log(user)
//     if (user) {
//       return res.status(409).json({ message: "from midleware : User already exists." });
//     }

//     // If user doesn't exist, continue to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error("Error checking user:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };
