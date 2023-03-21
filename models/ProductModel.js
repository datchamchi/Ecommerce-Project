const mongoose = require("mongoose");
const slugify = require("slugify");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have name"],
    },
    imageCover: {
      type: String,
      required: [true, "Must have image cover for product"],
    },
    filename: {
      type: String,
    },
    description: {
      type: String,
    },
    photo: [String],
    size: {
      type: String,
      enum: ["M", "L", "S"],
      default: "M",
    },
    color: {
      type: String,
    },
    priceOrigin: {
      type: Number,
      required: [true, "A product must have price origin"],
      min: 0,
    },
    priceSale: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      max: 5,
    },
    ratingsQuantity: Number,
    slug: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ProductSchema.virtual("price").get(function () {
  return (1 - this.priceSale) * this.priceOrigin;
});
// ProductSchema.pre(/^find/, function (next) {
//   this.price = (1 - this.priceSale) * this.priceOrigin;
//   next();
// });
ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    replacement: "-",
  });
  next();
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
