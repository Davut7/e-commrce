const { model, Schema } = require("mongoose");

const tokenSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
  resetToken: { type: String },
});

module.exports = model("Token", tokenSchema);
