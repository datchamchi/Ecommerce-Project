const mongoose = require("mongoose");
const Product = require("./ProductModel");

const ReviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "A review must have content"],
  },
  rating: {
    type: Number,
    required: [true, "You must rating this product"],
    max: 5,
    min: 1,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Must have product you want to review!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
ReviewSchema.statics.calcAverage = async function (productID) {
  const data = await this.aggregate([
    { $match: { product: productID } },
    {
      $group: {
        _id: "$product",
        rateQuantity: { $sum: 1 },
        ratingAverage: { $avg: "$rating" },
      },
    },
  ]);
  await Product.findByIdAndUpdate(productID, {
    ratingsAverage: data[0].ratingAverage,
    ratingsQuantity: data[0].rateQuantity,
  });
};
ReviewSchema.post("save", async function () {
  await this.constructor.calcAverage(this.product);
});

ReviewSchema.post(/^findOne/, async (doc) => {
  if (doc) await doc.constructor.calcAverage(doc.product);
});
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
