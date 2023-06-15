const { model, Schema } = require("mongoose");

const productSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  brand:{type: String, required: true},
  price: { type: String, required: true },
  quantity: { type: Number, required: true },
  color: [
    {
      type: Schema.ObjectId,
      ref: "productColor",
    },
  ],
  category: { type: String, required: true },
  ratings: [{ type: Schema.ObjectId, ref: "Review" }],
  ratingsAverage: { type: String },
  tags: [
    {
      type: String,
    },
  ],
});

module.exports = model("Product", productSchema);
