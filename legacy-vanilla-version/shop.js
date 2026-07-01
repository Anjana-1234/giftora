document.addEventListener("DOMContentLoaded", function () {
    const products = [
        { id: 1, name: "White Bouquet", price: 24, color: "white", img: "images/white.jpeg", champagneImg: "images/white_champagne.jpeg" },
        { id: 2, name: "Pink Bouquet", price: 30, color: "pink", img: "images/pink.jpeg", champagneImg: "images/pink_champagne.jpeg" },
        { id: 3, name: "Red Bouquet", price: 35, color: "red", img: "images/red.jpeg", champagneImg: "images/red_champagne.jpeg" },
        { id: 4, name: "Yellow Bouquet", price: 42, color: "yellow", img: "images/yellow.jpeg", champagneImg: "images/yellow_champagne.jpeg" },
        { id: 5, name: "Blue Bouquet", price: 28, color: "blue", img: "images/blue.jpeg", champagneImg: "images/blue_champagne.jpeg" },
        { id: 6, name: "Multi Bouquet", price: 40, color: "multi", img: "images/multi.jpg", champagneImg: "images/multi_champagne.jpeg" },
        { id: 7, name: "Green Bouquet", price: 32, color: "green", img: "images/green.jpg", champagneImg: "images/green_champagne.jpg" }
    ];

    const productList = document.getElementById("productList");
    let champagneAdded = false;

    // Initialize cart from localStorage or create empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let champagne = JSON.parse(localStorage.getItem("champagne")) || false;

    function renderProducts() {
        productList.innerHTML = "";

        let filteredProducts = [...products];
        const sortValue = document.getElementById("sort").value;
        const filterValue = document.getElementById("filter").value;

        // Filter by color
        if (filterValue !== "all") {
            filteredProducts = filteredProducts.filter(p => p.color === filterValue);
        }

        // Sort by price
        if (sortValue === "asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === "desc") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        // Render products
        filteredProducts.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.innerHTML = `
                <img id="img${product.id}" src="${champagne ? product.champagneImg : product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>£${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productDiv);
        });
    }

    window.addToCart = function (id) {
        const product = products.find(p => p.id === id);
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    };

    function renderCart() {
        const cartDiv = document.getElementById("cart");
        const totalPriceEl = document.getElementById("totalPrice");
        cartDiv.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            cartDiv.innerHTML += `<p>${item.name} (x${item.quantity}) - £${item.price * item.quantity}</p>`;
        });

        if (champagne) {
            total += 10;
            cartDiv.innerHTML += `<p>Champagne - £10</p>`;
        }

        totalPriceEl.textContent = `£${total.toFixed(2)}`;
    }

    // Champagne checkbox
    document.getElementById("champagne").addEventListener("change", function() {
        champagne = this.checked;
        localStorage.setItem("champagne", JSON.stringify(champagne));
        renderProducts();
        renderCart();
    });

    // Initialize champagne checkbox
    document.getElementById("champagne").checked = champagne;

    window.proceedToCart = function() {
        if (cart.length === 0) {
            alert("Please add items to your cart first");
            return;
        }
        window.location.href = "cart.html";
    };

    // Sort/filter listeners
    document.getElementById("sort").addEventListener("change", renderProducts);
    document.getElementById("filter").addEventListener("change", renderProducts);

    // Initial render
    renderProducts();
    renderCart();
});