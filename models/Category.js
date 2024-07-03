const mongoose = require("mongoose");

// Define SubCategory schema
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  categoryImage: String,
  subCategoryCode: { type: String, required: true, unique: true },
});

// Define Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  categoryImage: String,
  categoryCode: { type: String, required: true, unique: true },
  subCategories: [subCategorySchema],
});


const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
