const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: "https://via.placeholder.com/200x140?text=Product" },
  stock: { type: Number, default: 10, min: 0 }
});

module.exports = mongoose.model("Product", productSchema);