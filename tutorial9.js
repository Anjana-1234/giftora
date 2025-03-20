document.getElementById("bouquetOptions").addEventListener("change", function() {
    CheckOptions();
});

document.getElementById("flowerForm").addEventListener("reset", function() {
    resetOrder();
});

function getRadioValue(name) {
    let radios = document.getElementsByName(name);
    for (let radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

function CheckOptions() {
    let select = document.getElementById("bouquetOptions").value;
    let images = document.querySelectorAll(".product img");

    let defaultImages = ["images/white.jpeg", "images/pink.jpeg", "images/red.jpeg", "images/yellow.jpeg", "images/blue.jpeg"];
    let champagneImages = ["images/white_champagne.jpeg", "images/pink_champagne.jpeg", "images/red_champagne.jpeg", "images/yellow_champagne.jpeg", "images/blue_champagne.jpeg"];

    images.forEach((img, index) => {
        img.src = select.includes("Champagne") ? champagneImages[index] : defaultImages[index];
    });
}

function displayBouquet() {
    let chosenBouquet = getRadioValue("colour");
    let orderDiv = document.getElementById("order");

    if (chosenBouquet) {
        let bouquetId = {
            "white": "1",
            "pink": "2",
            "red": "3",
            "yellow": "4",
            "blue": "5"
        }[chosenBouquet];

        let productDiv = document.getElementById("product" + bouquetId).innerHTML;
        orderDiv.innerHTML = `<div class="product">${productDiv}</div>`;
    } else {
        orderDiv.innerHTML = "";
    }
}

function resetOrder() {
    document.getElementById("order").innerHTML = "";
    let defaultImages = ["images/white.jpeg", "images/pink.jpeg", "images/red.jpeg", "images/yellow.jpeg", "images/blue.jpeg"];
    let images = document.querySelectorAll(".product img");

    images.forEach((img, index) => {
        img.src = defaultImages[index];
    });
}