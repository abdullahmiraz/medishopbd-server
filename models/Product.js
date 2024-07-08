const mongoose = require("mongoose");

 
// Define Product schema
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
    pharmacology: { type: String },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema({
  batchNumber: { type: String },
  quantity: { type: Number },
  expirationDate: { type: String },
  aisleLocation: { type: String },
});

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
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
  stockDetails: [stockSchema],
  manufacturer: { type: String },
  requiresPrescription: { type: Boolean },
  pageCategory: { type: String },
  productImage: { type: String },
  leafletImage: { type: String },
  usageDetails: { type: usageSchema },
});

// Pre-save hook to generate unique productId
productSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) return next();
    const lastProduct = await this.constructor.findOne(
      {},
      {},
      { sort: { productId: -1 } }
    );
    this.productId = lastProduct ? lastProduct.productId + 1 : 1;
    next();
  } catch (err) {
    next(err);
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;