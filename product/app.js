const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Allows HTML forms to send PUT and DELETE requests via ?_method=PUT or ?_method=DELETE
app.use(methodOverride("_method"));

// In-memory product store
let nextId = 3;
let products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 799,
    description: "Ergonomic 2.4GHz wireless mouse with silent clicks."
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 2499,
    description: "Compact 75% mechanical keyboard with tactile switches."
  }
];

// Redirect root to /products
app.get("/", (req, res) => {
  res.redirect("/products");
});

// 1. INDEX (GET /products) - Display all products
app.get("/products", (req, res) => {
  res.render("index", { products });
});

// 2. NEW (GET /products/new) - Form to create a new product
app.get("/products/new", (req, res) => {
  res.render("new");
});

// 3. CREATE (POST /products) - Add new product
app.post("/products", (req, res) => {
  const { name, price, description } = req.body;
  products.push({
    id: nextId++,
    name: name.trim(),
    price: Number(price),
    description: description.trim()
  });
  res.redirect("/products");
});

// 4. SHOW (GET /products/:id) - Show details of a single product
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.render("show", { product });
});

// 5. EDIT (GET /products/:id/edit) - Form to edit an existing product
app.get("/products/:id/edit", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.render("edit", { product });
});

// 6. UPDATE (PUT /products/:id) - Update an existing product
app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");

  const { name, price, description } = req.body;
  product.name = name.trim();
  product.price = Number(price);
  product.description = description.trim();

  res.redirect(`/products/${product.id}`);
});

// 7. DELETE (DELETE /products/:id) - Remove a product
app.delete("/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.redirect("/products");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});