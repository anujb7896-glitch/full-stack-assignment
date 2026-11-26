const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(async () => {
    console.log("Connected to MongoDB");
    // Seed sample products if database is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        {
          name: "Wireless Earbuds",
          price: 1499,
          description: "Noise-isolating Bluetooth 5.3 earbuds with 24h battery.",
          image: "https://via.placeholder.com/220x140?text=Earbuds",
          stock: 15
        },
        {
          name: "Laptop Backpack",
          price: 1199,
          description: "Water-resistant 15.6-inch laptop backpack with USB port.",
          image: "https://via.placeholder.com/220x140?text=Backpack",
          stock: 20
        },
        {
          name: "Smart Fitness Band",
          price: 2299,
          description: "Heart rate, SpO2, and sleep tracking AMOLED band.",
          image: "https://via.placeholder.com/220x140?text=Fitness+Band",
          stock: 12
        }
      ]);
    }
  })
  .catch((err) => console.error("MongoDB error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "ecommerce-lab-secret",
    resave: false,
    saveUninitialized: true
  })
);

// Initialize cart and expose cart count to all views
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  res.locals.cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
  next();
});

// ================= STOREFRONT & CART =================

// Display all products
app.get("/", async (req, res) => {
  const products = await Product.find({});
  res.render("store", { products });
});

// Add item to cart
app.post("/cart/add/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect("/");

  const existing = req.session.cart.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  res.redirect("/cart");
});

// View cart
app.get("/cart", (req, res) => {
  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { cart, total });
});

// Remove item from cart
app.post("/cart/remove/:productId", (req, res) => {
  req.session.cart = req.session.cart.filter(
    (item) => item.productId !== req.params.productId
  );
  res.redirect("/cart");
});

// ================= PAYMENT & ORDERS =================

// Checkout / payment page
app.get("/checkout", (req, res) => {
  const cart = req.session.cart;
  if (cart.length === 0) return res.redirect("/");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("checkout", { cart, total });
});

// Process payment & create order
app.post("/checkout", async (req, res) => {
  const cart = req.session.cart;
  if (cart.length === 0) return res.redirect("/");

  const { customerName, address, paymentMethod } = req.body;
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await Order.create({
    customerName,
    address,
    paymentMethod,
    items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
    totalAmount
  });

  // Deduct stock and clear cart
  for (const item of cart) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }
  req.session.cart = [];

  res.redirect("/orders");
});

// Dedicated successful orders section
app.get("/orders", async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.render("orders", { orders });
});

// ================= SELLER MASTER PANEL =================

// View seller panel & add-product form
app.get("/seller", async (req, res) => {
  const products = await Product.find({});
  res.render("seller", { products });
});

// Add a new product
app.post("/seller/products", async (req, res) => {
  const { name, price, description, image, stock } = req.body;
  await Product.create({
    name,
    price: Number(price),
    description,
    image: image.trim() || "https://via.placeholder.com/220x140?text=Product",
    stock: Number(stock)
  });
  res.redirect("/seller");
});

// Edit product form
app.get("/seller/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect("/seller");
  res.render("edit-product", { product });
});

// Update product details
app.post("/seller/products/:id/edit", async (req, res) => {
  const { name, price, description, image, stock } = req.body;
  await Product.findByIdAndUpdate(req.params.id, {
    name,
    price: Number(price),
    description,
    image: image.trim() || "https://via.placeholder.com/220x140?text=Product",
    stock: Number(stock)
  });
  res.redirect("/seller");
});

app.listen(PORT, () => {
  console.log(`E-Commerce App running at http://localhost:${PORT}`);
});