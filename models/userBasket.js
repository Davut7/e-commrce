const { model, Schema } = require("mongoose");

const userBasketSchema = new Schema({
  product: [{ type: Schema.ObjectId, ref: "Product" }],
  user: { type: Schema.ObjectId, ref: "User" },
});

module.exports = model("Basket", userBasketSchema);
