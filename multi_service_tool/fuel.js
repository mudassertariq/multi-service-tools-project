// Fuel Cost Calculator with Metric/Imperial support

function updateFuelLabels() {
    const system = document.getElementById("unitSystem").value;

    if (system === "metric") {
        document.getElementById("distanceLabel").textContent = "Distance (Kilometers)";
        document.getElementById("averageLabel").textContent = "Average Fuel Consumption (km per liter)";
        document.getElementById("priceLabel").textContent = "Fuel Price per Liter";
        document.getElementById("distance").placeholder = "Enter distance in km";
        document.getElementById("average").placeholder = "e.g. 12";
        document.getElementById("price").placeholder = "e.g. 280";
    } else {
        document.getElementById("distanceLabel").textContent = "Distance (Miles)";
        document.getElementById("averageLabel").textContent = "Fuel Economy (miles per gallon)";
        document.getElementById("priceLabel").textContent = "Fuel Price per Gallon";
        document.getElementById("distance").placeholder = "Enter distance in miles";
        document.getElementById("average").placeholder = "e.g. 30";
        document.getElementById("price").placeholder = "e.g. 3.50";
    }
}

function calculateFuel() {
    const distance = parseFloat(document.getElementById("distance").value);
    const average = parseFloat(document.getElementById("average").value);
    const price = parseFloat(document.getElementById("price").value);
    const currency = document.getElementById("fuelCurrency").value;
    const system = document.getElementById("unitSystem").value;
    const resultEl = document.getElementById("fuelResult");
    const breakdownEl = document.getElementById("fuelBreakdown");

    if (isNaN(distance) || distance <= 0 || isNaN(average) || average <= 0 || isNaN(price) || price <= 0) {
        resultEl.innerText = "Enter valid values";
        breakdownEl.innerHTML = "";
        return;
    }

    // Fuel required = distance / average
    const fuelRequired = distance / average;
    const totalCost = fuelRequired * price;

    const distUnit = system === "metric" ? "km" : "miles";
    const fuelUnit = system === "metric" ? "liters" : "gallons";
    const consumUnit = system === "metric" ? "km/L" : "mpg";

    resultEl.innerText = `${currency} ${formatFuelNum(totalCost)}`;

    // Cost per unit distance
    const costPerUnit = totalCost / distance;

    breakdownEl.innerHTML = `
        <h3 style="color:#94a3b8; margin-bottom:10px;">Trip Breakdown</h3>
        <div class="fuel-breakdown-item">
            <span>Distance</span>
            <span>${formatFuelNum(distance)} ${distUnit}</span>
        </div>
        <div class="fuel-breakdown-item">
            <span>Fuel Economy</span>
            <span>${formatFuelNum(average)} ${consumUnit}</span>
        </div>
        <div class="fuel-breakdown-item">
            <span>Fuel Needed</span>
            <span>${formatFuelNum(fuelRequired)} ${fuelUnit}</span>
        </div>
        <div class="fuel-breakdown-item">
            <span>Price per ${system === "metric" ? "Liter" : "Gallon"}</span>
            <span>${currency} ${formatFuelNum(price)}</span>
        </div>
        <div class="fuel-breakdown-item">
            <span>Cost per ${system === "metric" ? "km" : "mile"}</span>
            <span>${currency} ${formatFuelNum(costPerUnit)}</span>
        </div>
        <div class="fuel-breakdown-item" style="border-top: 2px solid #38bdf8; margin-top: 10px; padding-top: 10px; font-weight: 600;">
            <span>Total Cost</span>
            <span>${currency} ${formatFuelNum(totalCost)}</span>
        </div>
    `;
}

function formatFuelNum(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
