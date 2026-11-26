const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let nextId = 3;
const products = [
  { id: 1, name: "Bluetooth Headphones", price: 1999, rating: 4.5 },
  { id: 2, name: "Smart Watch", price: 3499, rating: 4.2 }
];

// GET /api/products - Return all products as JSON
app.get("/api/products", (req, res) => {
  res.json(products);
});

// POST /api/products - Add a new product and return it
app.post("/api/products", (req, res) => {
  const { name, price, rating } = req.body;

  if (!name || price === undefined || rating === undefined) {
    return res.status(400).json({ error: "All fields (name, price, rating) are required." });
  }

  const newProduct = {
    id: nextId++,
    name: String(name).trim(),
    price: Number(price),
    rating: Number(rating)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});