const { model, Schema } = require("mongoose");

const productImageSchema = new Schema({
  filename: {
    type: Array,
  },
  product: { type: Schema.ObjectId, ref: "products" },
});

module.exports = model("productImage", productImageSchema);
