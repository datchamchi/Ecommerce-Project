const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    ma: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "A category must have name"],
    },
    imageCover: {
      type: String,
      required: [true, "A category must have image cover"],
    },
    filename: {
      type: String,
    },
    slug: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
  });
  this.ma = this.name
    .split(/\s+/)
    .map((el) => el.toUpperCase()[0])
    .join("");
  next();
});
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
