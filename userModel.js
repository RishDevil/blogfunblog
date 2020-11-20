const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  sub_des: { type: String, required: true },
  place: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, required: true },
  des: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
