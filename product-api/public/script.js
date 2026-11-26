const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

function renderProducts(products) {
  productList.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <div class="meta"><strong>ID:</strong> ${product.id}</div>
      <div class="meta"><strong>Price:</strong> ₹${product.price}</div>
      <div class="meta"><strong>Rating:</strong> ⭐ ${product.rating} / 5</div>
    `;

    productList.appendChild(card);
  });
}

async function loadProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();
  renderProducts(products);
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const rating = document.getElementById("rating").value;

  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, rating })
  });

  if (response.ok) {
    productForm.reset();
    loadProducts();
  }
});

loadProducts(); 