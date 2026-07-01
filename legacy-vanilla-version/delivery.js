document.addEventListener("DOMContentLoaded", function () {

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSummary = document.getElementById("cartSummary");
const totalPriceEl = document.getElementById("totalPrice");
const deliveryForm = document.getElementById("deliveryForm");

const onlineSection = document.getElementById("onlinePaymentSection");

let total = 0;


// SHOW CART SUMMARY

cart.forEach(item => {

const itemTotal = item.price * item.quantity;

total += itemTotal;

const p = document.createElement("p");

p.textContent =
`${item.name} (x${item.quantity}) - £${itemTotal}`;

cartSummary.appendChild(p);

});

totalPriceEl.textContent = `£${total}`;


// PAYMENT METHOD TOGGLE

const paymentRadios =
document.querySelectorAll('input[name="payment"]');

paymentRadios.forEach(radio => {

radio.addEventListener("change", function () {

if(this.value === "online"){

onlineSection.style.display = "block";

}else{

onlineSection.style.display = "none";

}

});

});


// FORM SUBMIT

deliveryForm.addEventListener("submit", function(e){

e.preventDefault();


const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;
const address = document.getElementById("address").value;
const date = document.getElementById("deliveryDate").value;

const paymentMethod =
document.querySelector('input[name="payment"]:checked').value;


// CARD VALIDATION

if(paymentMethod === "online"){

const cardName =
document.getElementById("cardName").value;

const cardNumber =
document.getElementById("cardNumber").value;

const expiry =
document.getElementById("expiry").value;

const cvv =
document.getElementById("cvv").value;

if(!cardName || !cardNumber || !expiry || !cvv){

alert("Please fill card payment details");

return;

}

}


// SHOW CONFIRMATION

document.getElementById("confirmEmail").textContent = email;

document.getElementById("confirmPhone").textContent = phone;

document.getElementById("confirmAddress").textContent = address;

document.getElementById("confirmDate").textContent = date;

document.getElementById("confirmPayment").textContent =
paymentMethod === "online"
? "Online Payment"
: "Cash on Delivery";

document.getElementById("confirmTotal").textContent =
`£${total}`;


document.getElementById("confirmationModal").style.display = "flex";


// CLEAR CART

localStorage.removeItem("cart");

});

});


function closeModal(){

document.getElementById("confirmationModal").style.display = "none";

}