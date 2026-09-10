const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // e.g. XS, S, M, L, XL
    color: { type: String, required: true }, // e.g. Black, Olive, Stone
    colorHex: { type: String, default: "#000000" },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String },
  },
  { _id: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["outerwear", "tops", "bottoms", "dresses", "footwear", "accessories"],
    },
    gender: { type: String, enum: ["men", "women", "unisex"], default: "unisex" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number }, // original price if discounted
    images: [{ type: String, required: true }], // URLs
    variants: [variantSchema],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

productSchema.virtual("totalStock").get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
