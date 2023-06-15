const { model, Schema } = require("mongoose");

const wishSchema = new Schema({
  product: { type: Schema.ObjectId, ref: "Product", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  comment: { type: String },
});

module.exports = model("Wish", wishSchema);
