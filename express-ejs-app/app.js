const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data from POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory data for demonstration
const notes = ["Complete Full Stack Lab File", "Revise Express Routing"];
const messages = [];

// Route 1 (GET): Home page
app.get("/", (req, res) => {
  res.render("index", { title: "Home", noteCount: notes.length });
});

// Route 2 (GET): About page
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// Route 3 (GET): Contact form page
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", submitted: false, messages });
});

// Route 4 (POST): Handle contact form submission
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (name && message) {
    messages.push({ name, email, message });
  }
  res.render("contact", { title: "Contact", submitted: true, messages });
});

// Route 5 (GET & POST): View and add notes
app.get("/notes", (req, res) => {
  res.render("notes", { title: "Notes", notes });
});

app.post("/notes", (req, res) => {
  const { note } = req.body;
  if (note && note.trim()) {
    notes.push(note.trim());
  }
  res.redirect("/notes");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});