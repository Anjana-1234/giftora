document.addEventListener("DOMContentLoaded", function() {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const champagne = JSON.parse(localStorage.getItem("champagne")) || false;
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const deliveryContent = document.getElementById("deliveryContent");
    const cartSummaryDiv = document.getElementById("cartSummary");
    const totalPriceEl = document.getElementById("totalPrice");
    const deliveryForm = document.getElementById("deliveryForm");
    const confirmationModal = document.getElementById("confirmationModal");
    const deliveryInput = document.getElementById("deliveryDate");

    // Set min date for delivery (today)
    const today = new Date().toISOString().split("T")[0];
    if (deliveryInput) {
        deliveryInput.setAttribute("min", today);
    }

    // Check if cart is empty
    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        deliveryContent.style.display = "none";
        return;
    } else {
        emptyCartMessage.style.display = "none";
        deliveryContent.style.display = "flex";
    }

    // Display order summary in the right panel
    function displayOrderSummary() {
        cartSummaryDiv.innerHTML = "";
        let total = 0;

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

        if (champagne) {
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
    deliveryForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Validate form
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const deliveryDate = document.getElementById("deliveryDate").value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        if (!name || !email || !phone || !address || !deliveryDate) {
            alert("Please fill in all required fields");
            return;
        }
        
        // Validate email format
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }
        
        // Validate phone number (basic validation)
        if (!validatePhone(phone)) {
            alert("Please enter a valid phone number");
            return;
        }
        
        // Validate delivery date is in the future
        const selectedDate = new Date(deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
            alert("Please select a future delivery date");
            return;
        }
        
        // Show confirmation modal
        showOrderConfirmation(name, email, phone, address, deliveryDate, paymentMethod);
    });

    // Show order confirmation modal
    function showOrderConfirmation(name, email, phone, address, deliveryDate, paymentMethod) {
        const deliveryTime = document.getElementById("deliveryTime").value;
        const instructions = document.getElementById("instructions").value;
        
        // Generate random order number
        const orderNumber = "VF" + Math.floor(Math.random() * 1000000);
        document.getElementById("orderNumber").textContent = orderNumber;
        
        // Update confirmation fields
        document.getElementById("confirmEmail").textContent = email;
        document.getElementById("confirmPhone").textContent = phone;
        document.getElementById("confirmAddress").textContent = address;
        document.getElementById("confirmDate").textContent = formatDate(deliveryDate);
        document.getElementById("confirmTime").textContent = getTimeText(deliveryTime);
        document.getElementById("confirmPayment").textContent = 
            paymentMethod === "online" ? "Online Payment" : "Cash on Delivery";
        document.getElementById("confirmTotal").textContent = totalPriceEl.textContent;
        
        // Handle special instructions
        const instructionsElement = document.getElementById("confirmInstructions");
        if (instructions) {
            instructionsElement.style.display = "block";
            document.getElementById("instructionsText").textContent = instructions;
        } else {
            instructionsElement.style.display = "none";
        }
        
        // Build order items list
        const orderItemsList = document.getElementById("orderItemsList");
        orderItemsList.innerHTML = "";
        
        cart.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "order-item";
            itemDiv.innerHTML = `
                <p>${item.name} (x${item.quantity}) - £${(item.price * item.quantity).toFixed(2)}</p>
            `;
            orderItemsList.appendChild(itemDiv);
        });
        
        if (champagne) {
            const champagneDiv = document.createElement("div");
            champagneDiv.className = "order-item";
            champagneDiv.innerHTML = `<p>Champagne - £10.00</p>`;
            orderItemsList.appendChild(champagneDiv);
        }
        
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

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        // Basic validation - at least 6 digits
        const re = /^[0-9]{6,}$/;
        return re.test(phone);
    }

    window.closeModal = function() {
        confirmationModal.style.display = "none";
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