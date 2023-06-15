const { model, Schema } = require("mongoose");

const reviewSchema = new Schema({
  rate: { type: Number, min: 1, max: 5 },
  review: { type: String, required: true },
  product: { type: Schema.ObjectId, ref: "Product" },
  postedBy: { type: Schema.ObjectId, ref: "User" },
});

module.exports = model("Review", reviewSchema);
