const mongoose = require("mongoose");

// Define SubCategory schema
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: {
    type: String,
    default: "https://placehold.co/600x400?text=SubCategory",
  },
  code: { type: String, required: true, unique: true },
});

// Define Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: {
    type: String,
    default: "https://placehold.co/600x400?text=Category",
  },
  code: { type: String, required: true, unique: true },
  subCategories: [subCategorySchema],
});

const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = Category;
