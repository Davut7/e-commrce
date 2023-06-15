const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  activationLink: { type: String },
  activationLinkExpirationTime: { type: Date },
  photo: { type: Schema.ObjectId, ref: "Photo" },
  basket: { type: Schema.ObjectId, ref: "Basket" },
});

module.exports = model("User", userSchema);
