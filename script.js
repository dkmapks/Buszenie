let cart = [];

function addProduct() {
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  if (name && price) {
    const product = { name, price };
    displayProduct(product);
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
  }
}

function displayProduct(product) {
  const productList = document.getElementById("product-list");
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.price.toFixed(2)} zł</p>
    <button onclick='addToCart("${product.name}", ${product.price})'>Dodaj do koszyka</button>
  `;
  productList.appendChild(div);
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const total = document.getElementById("total");
  const count = document.getElementById("cart-count");
  const orderData = document.getElementById("order-data");

  cartList.innerHTML = "";
  let sum = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} – ${item.price.toFixed(2)} zł`;
    cartList.appendChild(li);
    sum += item.price;
  });

  total.textContent = sum.toFixed(2);
  count.textContent = cart.length;
  orderData.value = cart.map(i => `${i.name}: ${i.price.toFixed(2)} zł`).join(", ");
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}
