const app = require("./app");
const PORT = process.env.PORT || 5000;
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// app.use(cors());
// app.use(express.json()); // This is crucial for parsing JSON bodies

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/", (req, res) => {
  res.send("Server is running");
});

// app.use((req, res, next) => {
//   console.log(
//     `Received ${req.method} request on ${req.url} with body:`,
//     req.body
//   );
//   next();
// });
