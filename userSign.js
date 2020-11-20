const mongoose = require("mongoose");

const signSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

const signModel = mongoose.model("User", signSchema);

module.exports = signModel;
