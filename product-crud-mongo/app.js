const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Product = require("./models/Product/product");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/productDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Redirect root to /products
app.get("/", (req, res) => {
  res.redirect("/products");
});

// 1. INDEX (GET /products) - List all products from MongoDB
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("index", { products });
});

// 2. NEW (GET /products/new) - Form to add a product
app.get("/products/new", (req, res) => {
  res.render("new");
});

// 3. CREATE (POST /products) - Save a new product in MongoDB
app.post("/products", async (req, res) => {
  const { name, price, description } = req.body;
  await Product.create({ name, price, description });
  res.redirect("/products");
});

// 4. SHOW (GET /products/:id) - View a single product by MongoDB _id
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("show", { product });
});

// 5. EDIT (GET /products/:id/edit) - Form to edit a product
app.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("edit", { product });
});

// 6. UPDATE (PUT /products/:id) - Update product in MongoDB
app.put("/products/:id", async (req, res) => {
  const { name, price, description } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, description },
    { runValidators: true, new: true }
  );
  if (!product) return res.status(404).send("Product not found");
  res.redirect(`/products/${product._id}`);
});

// 7. DELETE (DELETE /products/:id) - Delete product from MongoDB
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});