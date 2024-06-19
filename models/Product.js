const mongoose = require("mongoose");

// Schema for packaging details
const packagingSchema = new mongoose.Schema(
  {
    unitsPerStrip: { type: Number, required: true },
    stripsPerBox: { type: Number, required: true },
  },
  { _id: false }
);

// Schema for indications
const indicationsSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    subtitles: [{ type: String, required: true }],
  },
  { _id: false }
);

// Schema for dosage details for different age groups
const dosageDetailSchema = new mongoose.Schema(
  {
    ageRange: { type: String, required: true },
    userGroup: { type: String, required: true },
    dosageInstructions: [{ type: String, required: true }],
  },
  { _id: false }
);

// Schema for usage details
const usageSchema = new mongoose.Schema(
  {
    indications: indicationsSchema,
    dosageDetails: [dosageDetailSchema],
  },
  { _id: false }
);

// Main product schema
const productSchema = new mongoose.Schema({
  productId: { type: Number },
  productName: { type: String, required: true },
  measure: { type: String },
  activeIngredient: { type: String, required: true },
  dosageForm: { type: String, required: true },
  applicationArea: { type: String, required: true },
  primaryCategory: { type: String },
  subCategory: { type: String },
  productType: { type: String },
  packaging: { type: packagingSchema, required: true },
  pricePerUnit: { type: Number, required: true },
  availableStock: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  batchNumber: { type: String, required: true },
  aisleLocation: { type: String, required: true },
  requiresPrescription: { type: Boolean, required: true },
  pageCategory: { type: String, required: true },
  productImage: { type: String, required: true },
  usageDetails: { type: usageSchema },
  pharmacology: { type: String },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
