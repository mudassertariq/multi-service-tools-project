// Tax Calculator with Country-Specific Progressive Tax Brackets

const TAX_BRACKETS = {
    us: {
        name: "United States (Federal 2025)",
        currency: "USD",
        brackets: [
            { min: 0, max: 11600, rate: 10 },
            { min: 11600, max: 47150, rate: 12 },
            { min: 47150, max: 100525, rate: 22 },
            { min: 100525, max: 191950, rate: 24 },
            { min: 191950, max: 243725, rate: 32 },
            { min: 243725, max: 609350, rate: 35 },
            { min: 609350, max: Infinity, rate: 37 }
        ]
    },
    uk: {
        name: "United Kingdom (2025/26)",
        currency: "GBP",
        brackets: [
            { min: 0, max: 12570, rate: 0 },
            { min: 12570, max: 50270, rate: 20 },
            { min: 50270, max: 125140, rate: 40 },
            { min: 125140, max: Infinity, rate: 45 }
        ]
    },
    pakistan: {
        name: "Pakistan (2024/25)",
        currency: "PKR",
        brackets: [
            { min: 0, max: 600000, rate: 0 },
            { min: 600000, max: 1200000, rate: 5 },
            { min: 1200000, max: 2200000, rate: 15 },
            { min: 2200000, max: 3200000, rate: 25 },
            { min: 3200000, max: 4100000, rate: 30 },
            { min: 4100000, max: Infinity, rate: 35 }
        ]
    },
    india: {
        name: "India (New Regime 2025/26)",
        currency: "INR",
        brackets: [
            { min: 0, max: 400000, rate: 0 },
            { min: 400000, max: 800000, rate: 5 },
            { min: 800000, max: 1200000, rate: 10 },
            { min: 1200000, max: 1600000, rate: 15 },
            { min: 1600000, max: 2000000, rate: 20 },
            { min: 2000000, max: 2400000, rate: 25 },
            { min: 2400000, max: Infinity, rate: 30 }
        ]
    },
    canada: {
        name: "Canada (Federal 2025)",
        currency: "CAD",
        brackets: [
            { min: 0, max: 57375, rate: 15 },
            { min: 57375, max: 114750, rate: 20.5 },
            { min: 114750, max: 158468, rate: 26 },
            { min: 158468, max: 220000, rate: 29 },
            { min: 220000, max: Infinity, rate: 33 }
        ]
    },
    australia: {
        name: "Australia (2024/25)",
        currency: "AUD",
        brackets: [
            { min: 0, max: 18200, rate: 0 },
            { min: 18200, max: 45000, rate: 16 },
            { min: 45000, max: 135000, rate: 30 },
            { min: 135000, max: 190000, rate: 37 },
            { min: 190000, max: Infinity, rate: 45 }
        ]
    },
    germany: {
        name: "Germany (2025)",
        currency: "EUR",
        brackets: [
            { min: 0, max: 11784, rate: 0 },
            { min: 11784, max: 17005, rate: 14 },
            { min: 17005, max: 66760, rate: 24 },
            { min: 66760, max: 277825, rate: 42 },
            { min: 277825, max: Infinity, rate: 45 }
        ]
    },
    uae: {
        name: "UAE",
        currency: "AED",
        brackets: [
            { min: 0, max: Infinity, rate: 0 }
        ]
    }
};

const CURRENCY_SYMBOLS = {
    USD: "$", GBP: "£", EUR: "€", PKR: "₨",
    INR: "₹", CAD: "C$", AUD: "A$", AED: "د.إ"
};

function onCountryChange() {
    const country = document.getElementById("taxCountry").value;
    const customContainer = document.getElementById("customRateContainer");
    const currencySelect = document.getElementById("taxCurrency");

    if (country === "custom") {
        customContainer.style.display = "block";
    } else {
        customContainer.style.display = "none";
        // Auto-set currency
        if (TAX_BRACKETS[country]) {
            currencySelect.value = TAX_BRACKETS[country].currency;
        }
    }
}

function calculateTax() {
    const income = parseFloat(document.getElementById("income").value);
    const country = document.getElementById("taxCountry").value;
    const currency = document.getElementById("taxCurrency").value;
    const taxAmountEl = document.getElementById("taxAmount");
    const netIncomeEl = document.getElementById("netIncome");
    const effectiveRateEl = document.getElementById("effectiveRate");
    const breakdownEl = document.getElementById("taxBreakdown");
    const symbol = CURRENCY_SYMBOLS[currency] || currency;

    if (isNaN(income) || income <= 0) {
        taxAmountEl.innerText = "Enter valid income";
        netIncomeEl.innerText = "-";
        effectiveRateEl.innerText = "-";
        breakdownEl.innerHTML = "";
        return;
    }

    let totalTax = 0;
    let breakdownHTML = "<h3 style='color:#94a3b8; margin-bottom:10px;'>Tax Breakdown</h3>";

    if (country === "custom") {
        const rate = parseFloat(document.getElementById("customRate").value);
        if (isNaN(rate) || rate < 0 || rate > 100) {
            taxAmountEl.innerText = "Enter valid tax rate";
            netIncomeEl.innerText = "-";
            effectiveRateEl.innerText = "-";
            breakdownEl.innerHTML = "";
            return;
        }
        totalTax = (income * rate) / 100;
        breakdownHTML += `
            <div class="tax-breakdown-item">
                <span>Flat rate ${rate}%</span>
                <span>${symbol} ${formatNum(totalTax)}</span>
            </div>
        `;
    } else {
        const brackets = TAX_BRACKETS[country].brackets;
        breakdownHTML += `<p style='font-size:12px; color:#64748b; margin-bottom:10px;'>${TAX_BRACKETS[country].name}</p>`;

        brackets.forEach(bracket => {
            if (income > bracket.min) {
                const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
                const taxInBracket = (taxableInBracket * bracket.rate) / 100;
                totalTax += taxInBracket;

                const maxLabel = bracket.max === Infinity ? "+" : formatNum(bracket.max);
                breakdownHTML += `
                    <div class="tax-breakdown-item">
                        <span>${symbol}${formatNum(bracket.min)} - ${symbol}${maxLabel} @ ${bracket.rate}%</span>
                        <span>${symbol} ${formatNum(taxInBracket)}</span>
                    </div>
                `;
            }
        });
    }

    const netIncome = income - totalTax;
    const effectiveRate = ((totalTax / income) * 100).toFixed(2);

    taxAmountEl.innerText = `${symbol} ${formatNum(totalTax)}`;
    netIncomeEl.innerText = `${symbol} ${formatNum(netIncome)}`;
    effectiveRateEl.innerText = `${effectiveRate}%`;

    breakdownHTML += `
        <div class="tax-breakdown-item" style="border-top: 2px solid #38bdf8; margin-top: 10px; padding-top: 10px; font-weight: 600;">
            <span>Total Tax</span>
            <span>${symbol} ${formatNum(totalTax)}</span>
        </div>
    `;

    breakdownEl.innerHTML = breakdownHTML;
}

function formatNum(num) {
    if (num === Infinity) return "∞";
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    onCountryChange();
});
