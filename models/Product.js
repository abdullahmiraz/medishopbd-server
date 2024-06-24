const mongoose = require("mongoose");

// Schema for packaging details
const packagingSchema = new mongoose.Schema(
  {
    unitsPerStrip: { type: Number },
    stripsPerBox: { type: Number },
  },
  { _id: false }
);

const dosageDetailSchema = new mongoose.Schema(
  {
    ageRange: { type: String },
    userGroup: { type: String },
    dosageInstructions: [{ type: String }],
  },
  { _id: false }
);

const indicationsSchema = new mongoose.Schema(
  {
    mainTitle: { type: String },
    subtitles: [{ type: String }],
  },
  { _id: false }
);

const usageSchema = new mongoose.Schema(
  {
    indications: indicationsSchema,
    dosageDetails: [dosageDetailSchema],
  },
  { _id: false }
);

// Main product schema

// Main product schema
const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true }, // Ensure productId is unique
  productName: { type: String },
  measure: { type: String },
  activeIngredient: { type: String },
  dosageForm: { type: String },
  applicationArea: { type: String },
  primaryCategory: { type: String },
  subCategory: { type: String },
  productType: { type: String },
  packaging: { type: packagingSchema },
  pricePerUnit: { type: Number },
  availableStock: { type: Number },
  manufacturer: { type: String },
  expirationDate: { type: Date },
  batchNumber: { type: String },
  aisleLocation: { type: String },
  requiresPrescription: { type: Boolean },
  pageCategory: { type: String },
  productImage: { type: String },
  usageDetails: { type: usageSchema },
  pharmacology: { type: String },
});

// Pre-save hook to generate unique productId
productSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next(); // If not new document, do nothing
    }

    // Generate a unique productId
    let lastProduct = await this.constructor.findOne(
      {},
      {},
      { sort: { productId: -1 } }
    ); // Find the last product based on productId descending
    let newProductId = 1; // Default starting value

    if (lastProduct) {
      newProductId = lastProduct.productId + 1; // Increment the last productId by 1
    }

    this.productId = newProductId; // Assign the new productId
    next();
  } catch (err) {
    next(err);
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
