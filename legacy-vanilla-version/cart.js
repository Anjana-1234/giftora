document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const champagneAdded = JSON.parse(localStorage.getItem("champagne")) || false;
    const cartItemsDiv = document.getElementById("cartItems");
    const emptyCartDiv = document.getElementById("emptyCart");
    const summaryDetailsDiv = document.getElementById("summaryDetails");
    const totalPriceEl = document.getElementById("cartTotal");
    const champagneCheckbox = document.getElementById("champagne");

    // Set initial checkbox state
    champagneCheckbox.checked = champagneAdded;

    // Update cart display
    updateCartDisplay();

    // Champagne checkbox event
    champagneCheckbox.addEventListener("change", function() {
        localStorage.setItem("champagne", this.checked);
        updateCartDisplay();
    });

    function updateCartDisplay() {
        cartItemsDiv.innerHTML = "";
        summaryDetailsDiv.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            emptyCartDiv.style.display = "block";
            document.querySelector(".cart-container").style.display = "none";
            return;
        }

        emptyCartDiv.style.display = "none";
        document.querySelector(".cart-container").style.display = "flex";

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Cart items display
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item";
            cartItemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>£${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <p class="item-total">£${itemTotal.toFixed(2)}</p>
                <button class="remove-btn" onclick="removeItem(${index})">×</button>
            `;
            cartItemsDiv.appendChild(cartItemDiv);

            // Summary details
            summaryDetailsDiv.innerHTML += `
                <p>${item.name} (x${item.quantity}) - £${itemTotal.toFixed(2)}</p>
            `;
        });

        // Add champagne to total if selected
        if (champagneCheckbox.checked) {
            total += 10;
            summaryDetailsDiv.innerHTML += `<p>Champagne - £10.00</p>`;
        }

        totalPriceEl.textContent = `£${total.toFixed(2)}`;
    }

    window.updateQuantity = function(index, change) {
        cart[index].quantity += change;
        
        // Remove item if quantity reaches 0
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    };
});