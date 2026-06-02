// Currency Converter with Live API
// Uses the free ExchangeRate-API (no key required)

const CURRENCY_NAMES = {
    AED: "UAE Dirham", AFN: "Afghan Afghani", ALL: "Albanian Lek", AMD: "Armenian Dram",
    ANG: "Netherlands Antillean Guilder", AOA: "Angolan Kwanza", ARS: "Argentine Peso",
    AUD: "Australian Dollar", AWG: "Aruban Florin", AZN: "Azerbaijani Manat",
    BAM: "Bosnia-Herzegovina Convertible Mark", BBD: "Barbadian Dollar", BDT: "Bangladeshi Taka",
    BGN: "Bulgarian Lev", BHD: "Bahraini Dinar", BIF: "Burundian Franc", BMD: "Bermudan Dollar",
    BND: "Brunei Dollar", BOB: "Bolivian Boliviano", BRL: "Brazilian Real", BSD: "Bahamian Dollar",
    BTN: "Bhutanese Ngultrum", BWP: "Botswanan Pula", BYN: "Belarusian Ruble", BZD: "Belize Dollar",
    CAD: "Canadian Dollar", CDF: "Congolese Franc", CHF: "Swiss Franc", CLP: "Chilean Peso",
    CNY: "Chinese Yuan", COP: "Colombian Peso", CRC: "Costa Rican Colón", CUP: "Cuban Peso",
    CVE: "Cape Verdean Escudo", CZK: "Czech Koruna", DJF: "Djiboutian Franc", DKK: "Danish Krone",
    DOP: "Dominican Peso", DZD: "Algerian Dinar", EGP: "Egyptian Pound", ERN: "Eritrean Nakfa",
    ETB: "Ethiopian Birr", EUR: "Euro", FJD: "Fijian Dollar", FKP: "Falkland Islands Pound",
    FOK: "Faroese Króna", GBP: "British Pound Sterling", GEL: "Georgian Lari", GGP: "Guernsey Pound",
    GHS: "Ghanaian Cedi", GIP: "Gibraltar Pound", GMD: "Gambian Dalasi", GNF: "Guinean Franc",
    GTQ: "Guatemalan Quetzal", GYD: "Guyanaese Dollar", HKD: "Hong Kong Dollar",
    HNL: "Honduran Lempira", HRK: "Croatian Kuna", HTG: "Haitian Gourde", HUF: "Hungarian Forint",
    IDR: "Indonesian Rupiah", ILS: "Israeli New Sheqel", IMP: "Manx Pound", INR: "Indian Rupee",
    IQD: "Iraqi Dinar", IRR: "Iranian Rial", ISK: "Icelandic Króna", JEP: "Jersey Pound",
    JMD: "Jamaican Dollar", JOD: "Jordanian Dinar", JPY: "Japanese Yen", KES: "Kenyan Shilling",
    KGS: "Kyrgystani Som", KHR: "Cambodian Riel", KID: "Kiribati Dollar", KMF: "Comorian Franc",
    KRW: "South Korean Won", KWD: "Kuwaiti Dinar", KYD: "Cayman Islands Dollar",
    KZT: "Kazakhstani Tenge", LAK: "Laotian Kip", LBP: "Lebanese Pound", LKR: "Sri Lankan Rupee",
    LRD: "Liberian Dollar", LSL: "Lesotho Loti", LYD: "Libyan Dinar", MAD: "Moroccan Dirham",
    MDL: "Moldovan Leu", MGA: "Malagasy Ariary", MKD: "Macedonian Denar", MMK: "Myanma Kyat",
    MNT: "Mongolian Tugrik", MOP: "Macanese Pataca", MRU: "Mauritanian Ouguiya",
    MUR: "Mauritian Rupee", MVR: "Maldivian Rufiyaa", MWK: "Malawian Kwacha", MXN: "Mexican Peso",
    MYR: "Malaysian Ringgit", MZN: "Mozambican Metical", NAD: "Namibian Dollar",
    NGN: "Nigerian Naira", NIO: "Nicaraguan Córdoba", NOK: "Norwegian Krone", NPR: "Nepalese Rupee",
    NZD: "New Zealand Dollar", OMR: "Omani Rial", PAB: "Panamanian Balboa", PEN: "Peruvian Nuevo Sol",
    PGK: "Papua New Guinean Kina", PHP: "Philippine Peso", PKR: "Pakistani Rupee",
    PLN: "Polish Zloty", PYG: "Paraguayan Guarani", QAR: "Qatari Rial", RON: "Romanian Leu",
    RSD: "Serbian Dinar", RUB: "Russian Ruble", RWF: "Rwandan Franc", SAR: "Saudi Riyal",
    SBD: "Solomon Islands Dollar", SCR: "Seychellois Rupee", SDG: "Sudanese Pound",
    SEK: "Swedish Krona", SGD: "Singapore Dollar", SHP: "Saint Helena Pound", SLE: "Sierra Leonean Leone",
    SOS: "Somali Shilling", SRD: "Surinamese Dollar", SSP: "South Sudanese Pound",
    STN: "São Tomé and Príncipe Dobra", SYP: "Syrian Pound", SZL: "Swazi Lilangeni",
    THB: "Thai Baht", TJS: "Tajikistani Somoni", TMT: "Turkmenistani Manat",
    TND: "Tunisian Dinar", TOP: "Tongan Paʻanga", TRY: "Turkish Lira", TTD: "Trinidad and Tobago Dollar",
    TVD: "Tuvaluan Dollar", TWD: "New Taiwan Dollar", TZS: "Tanzanian Shilling",
    UAH: "Ukrainian Hryvnia", UGX: "Ugandan Shilling", USD: "US Dollar", UYU: "Uruguayan Peso",
    UZS: "Uzbekistan Som", VES: "Venezuelan Bolívar", VND: "Vietnamese Dong", VUV: "Vanuatu Vatu",
    WST: "Samoan Tala", XAF: "CFA Franc BEAC", XCD: "East Caribbean Dollar",
    XDR: "Special Drawing Rights", XOF: "CFA Franc BCEAO", XPF: "CFP Franc",
    YER: "Yemeni Rial", ZAR: "South African Rand", ZMW: "Zambian Kwacha", ZWL: "Zimbabwean Dollar"
};

const API_BASE = "https://open.er-api.com/v6/latest";
let cachedRates = {};
let lastFetchBase = "";

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    const fromSelect = document.getElementById("fromCurrency");
    const toSelect = document.getElementById("toCurrency");

    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    const sortedCodes = Object.keys(CURRENCY_NAMES).sort();

    sortedCodes.forEach(code => {
        const name = CURRENCY_NAMES[code];
        const optionFrom = new Option(`${code} - ${name}`, code);
        const optionTo = new Option(`${code} - ${name}`, code);
        fromSelect.add(optionFrom);
        toSelect.add(optionTo);
    });

    // Default selections
    fromSelect.value = "USD";
    toSelect.value = "PKR";
}

// Fetch live exchange rates
async function fetchRates(baseCurrency) {
    if (cachedRates[baseCurrency] && Date.now() - cachedRates[baseCurrency].timestamp < 600000) {
        return cachedRates[baseCurrency].rates;
    }

    try {
        const response = await fetch(`${API_BASE}/${baseCurrency}`);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        if (data.result === "success") {
            cachedRates[baseCurrency] = {
                rates: data.rates,
                timestamp: Date.now()
            };
            return data.rates;
        } else {
            throw new Error(data["error-type"] || "Unknown error");
        }
    } catch (error) {
        console.error("Failed to fetch rates:", error);
        showToast("Failed to fetch live rates. Please try again.", "error");
        return null;
    }
}

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("fromCurrency").value;
    const to = document.getElementById("toCurrency").value;
    const resultEl = document.getElementById("result");
    const rateInfoEl = document.getElementById("rateInfo");

    if (isNaN(amount) || amount <= 0) {
        resultEl.innerText = "Enter a valid amount";
        rateInfoEl.innerText = "";
        return;
    }

    if (!from || !to) {
        resultEl.innerText = "Select currencies";
        return;
    }

    // Show loading
    resultEl.innerHTML = '<div class="loading-spinner"></div>';
    rateInfoEl.innerText = "Fetching live rates...";

    const rates = await fetchRates(from);

    if (rates && rates[to]) {
        const rate = rates[to];
        const converted = amount * rate;

        resultEl.innerText = formatNumber(converted) + " " + to;
        rateInfoEl.innerText = `1 ${from} = ${rate.toFixed(6)} ${to} • Live rate`;
    } else {
        resultEl.innerText = "Conversion failed";
        rateInfoEl.innerText = "Could not fetch exchange rate. Please try again.";
    }
}

// Swap currencies
function swapCurrencies() {
    const fromSelect = document.getElementById("fromCurrency");
    const toSelect = document.getElementById("toCurrency");
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
}

// Format number with commas
function formatNumber(num) {
    if (num >= 1) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toFixed(6);
}

// Toast notification
function showToast(message, type = "info") {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    populateCurrencyDropdowns();
});
