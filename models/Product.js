const mongoose = require("mongoose");

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

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
  productName: { type: String },
  measure: { type: String },
  activeIngredient: { type: String },
  dosageForm: { type: String },
  applicationArea: { type: String },
  primaryCategory: {
    type: String,
    enum: [
      "Medicine",
      "Nutrition",
      "Personal Care",
      "Baby Care",
      "Health Care",
      "Herbal Products",
      "Baby Food",
      "Skin Care",
      "Uncategorized",
    ],
  },
  subCategory: { type: String },
  productType: { type: String },
  packaging: { type: packagingSchema },
  pricePerUnit: { type: Number },
  availableStock: { type: Number },
  manufacturer: { type: String },
  expirationDate: { type: String },
  batchNumber: { type: String },
  aisleLocation: { type: String },
  requiresPrescription: { type: Boolean },
  pageCategory: { type: String },
  productImage: { type: String },
  leafletImage: { type: String },
  usageDetails: { type: usageSchema },
  pharmacology: { type: String },
});

// Pre-save hook to generate unique productId
productSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    let lastProduct = await this.constructor.findOne(
      {},
      {},
      { sort: { productId: -1 } }
    );
    let newProductId = 1;

    if (lastProduct) {
      newProductId = lastProduct.productId + 1;
    }

    this.productId = newProductId;
    next();
  } catch (err) {
    next(err);
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
