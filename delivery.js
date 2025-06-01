document.addEventListener("DOMContentLoaded", function() {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const champagneAdded = JSON.parse(localStorage.getItem("champagne")) || false;
    const cartSummaryDiv = document.getElementById("cartSummary");
    const totalPriceEl = document.getElementById("totalPrice");
    const deliveryForm = document.getElementById("deliveryForm");
    const confirmationModal = document.getElementById("confirmationModal");
    const finalSummaryDiv = document.getElementById("finalSummary");
    const orderNumberSpan = document.getElementById("orderNumber");

    // Display order summary
    function displayOrderSummary() {
        cartSummaryDiv.innerHTML = "";
        let total = 0;

        // if (cart.length === 0) {
        //     // Redirect to cart if empty
        //     setTimeout(() => {
        //         window.location.href = "cart.html";
        //     }, 1500);
        //     return;
        // }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemDiv = document.createElement("div");
            itemDiv.className = "summary-item";
            itemDiv.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name} (x${item.quantity})</span>
                    <span class="item-price">£${itemTotal.toFixed(2)}</span>
                </div>
            `;
            cartSummaryDiv.appendChild(itemDiv);
        });

        if (champagneAdded) {
            total += 10;
            const champagneDiv = document.createElement("div");
            champagneDiv.className = "summary-item";
            champagneDiv.innerHTML = `
                <div class="item-info">
                    <span class="item-name">Champagne</span>
                    <span class="item-price">£10.00</span>
                </div>
            `;
            cartSummaryDiv.appendChild(champagneDiv);
        }

        totalPriceEl.textContent = `£${total.toFixed(2)}`;
    }

    // Form submission handler
    if (deliveryForm) {
        deliveryForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Validate form
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();
            const deliveryDate = document.getElementById("deliveryDate").value;
            
            if (!name || !email || !phone || !address || !deliveryDate) {
                alert("Please fill in all required fields");
                return;
            }
            
            // Show confirmation modal
            showOrderConfirmation(name, email, phone, address, deliveryDate);
        });
    }

    // Show order confirmation
    function showOrderConfirmation(name, email, phone, address, deliveryDate) {
        const deliveryTime = document.getElementById("deliveryTime").value;
        const instructions = document.getElementById("instructions").value;
        
        // Generate random order number
        const orderNumber = "VF" + Math.floor(Math.random() * 1000000);
        orderNumberSpan.textContent = orderNumber;
        
        // Build summary
        let summaryHTML = `
            <div class="customer-info">
                <p><strong>Customer:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
            </div>
            
            <div class="delivery-info">
                <p><strong>Delivery Address:</strong> ${address}</p>
                <p><strong>Delivery Date:</strong> ${formatDate(deliveryDate)}</p>
                <p><strong>Delivery Time:</strong> ${getTimeText(deliveryTime)}</p>
                ${instructions ? `<p><strong>Instructions:</strong> ${instructions}</p>` : ''}
            </div>
            
            <div class="order-items">
                <h3>Order Items</h3>
        `;
        
        cart.forEach(item => {
            summaryHTML += `
                <p>${item.name} (x${item.quantity}) - £${(item.price * item.quantity).toFixed(2)}</p>
            `;
        });
        
        if (champagneAdded) {
            summaryHTML += `<p>Champagne - £10.00</p>`;
        }
        
        summaryHTML += `
            </div>
            <div class="order-total">
                <p><strong>Total:</strong> ${totalPriceEl.textContent}</p>
            </div>
        `;
        
        finalSummaryDiv.innerHTML = summaryHTML;
        
        // Show modal
        confirmationModal.style.display = "flex";
        
        // Clear cart after order
        localStorage.removeItem("cart");
        localStorage.removeItem("champagne");
    }

    // Helper functions
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-UK', options);
    }

    function getTimeText(timeValue) {
        const times = {
            anytime: "Anytime during the day",
            morning: "Morning (9am-12pm)",
            afternoon: "Afternoon (12pm-5pm)",
            evening: "Evening (5pm-9pm)"
        };
        return times[timeValue] || "Anytime during the day";
    }

    window.closeModal = function() {
        document.getElementById("confirmationModal").style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == confirmationModal) {
            closeModal();
        }
    };

    // Initialize
    displayOrderSummary();
});