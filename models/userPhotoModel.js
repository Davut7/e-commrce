const { model, Schema } = require("mongoose");

const photoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
});

module.exports = model("Photo", photoSchema);
