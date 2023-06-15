const { model, Schema } = require("mongoose");

const productColorSchema = new Schema({
  color: {
    type: String,
    unique: true,
    required: true,
  },
  photo: [
    {
      type: Schema.ObjectId,
      ref: "productImage",
    },
  ],
});

module.exports = model("productColor", productColorSchema);
