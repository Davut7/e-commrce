const { model, Schema } = require("mongoose");

const cardSchema = new Schema({
  products: [{ type: Schema.ObjectId, ref: "Product" }],
  user: { type: Schema.ObjectId, ref: "User" },
});

module.exports = model("Card", cardSchema);
