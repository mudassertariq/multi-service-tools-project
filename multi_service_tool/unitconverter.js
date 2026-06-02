// Unit Converter - Comprehensive with all conversion paths

const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const typeSelect = document.getElementById("conversionType");
const resultEl = document.getElementById("unitResult");

// Units with conversion factors to a base unit
// For each category, all values convert TO the base unit via multiplication
const unitData = {
    length: {
        base: "Meter",
        units: {
            "Millimeter": 0.001,
            "Centimeter": 0.01,
            "Meter": 1,
            "Kilometer": 1000,
            "Inch": 0.0254,
            "Foot": 0.3048,
            "Yard": 0.9144,
            "Mile": 1609.344,
            "Nautical Mile": 1852,
            "Micrometer": 0.000001
        }
    },
    weight: {
        base: "Kilogram",
        units: {
            "Milligram": 0.000001,
            "Gram": 0.001,
            "Kilogram": 1,
            "Metric Ton": 1000,
            "Ounce": 0.0283495,
            "Pound": 0.453592,
            "Stone": 6.35029,
            "US Ton": 907.185,
            "Imperial Ton": 1016.05
        }
    },
    temperature: {
        base: "special",
        units: {
            "Celsius": null,
            "Fahrenheit": null,
            "Kelvin": null
        }
    },
    area: {
        base: "Square Meter",
        units: {
            "Square Millimeter": 0.000001,
            "Square Centimeter": 0.0001,
            "Square Meter": 1,
            "Square Kilometer": 1000000,
            "Hectare": 10000,
            "Acre": 4046.86,
            "Square Foot": 0.092903,
            "Square Yard": 0.836127,
            "Square Inch": 0.00064516,
            "Square Mile": 2589988
        }
    },
    volume: {
        base: "Liter",
        units: {
            "Milliliter": 0.001,
            "Liter": 1,
            "Cubic Meter": 1000,
            "Gallon (US)": 3.78541,
            "Gallon (UK)": 4.54609,
            "Quart (US)": 0.946353,
            "Pint (US)": 0.473176,
            "Cup (US)": 0.236588,
            "Fluid Ounce (US)": 0.0295735,
            "Tablespoon": 0.0147868,
            "Teaspoon": 0.00492892,
            "Cubic Centimeter": 0.001,
            "Cubic Foot": 28.3168,
            "Cubic Inch": 0.0163871
        }
    },
    speed: {
        base: "Meters per Second",
        units: {
            "Meters per Second": 1,
            "Kilometers per Hour": 0.277778,
            "Miles per Hour": 0.44704,
            "Knots": 0.514444,
            "Feet per Second": 0.3048,
            "Mach": 343
        }
    },
    time: {
        base: "Second",
        units: {
            "Millisecond": 0.001,
            "Second": 1,
            "Minute": 60,
            "Hour": 3600,
            "Day": 86400,
            "Week": 604800,
            "Month (30 days)": 2592000,
            "Year (365 days)": 31536000
        }
    },
    data: {
        base: "Byte",
        units: {
            "Bit": 0.125,
            "Byte": 1,
            "Kilobyte (KB)": 1024,
            "Megabyte (MB)": 1048576,
            "Gigabyte (GB)": 1073741824,
            "Terabyte (TB)": 1099511627776,
            "Petabyte (PB)": 1125899906842624
        }
    }
};

// Populate units based on selected category
function updateUnits() {
    const type = typeSelect.value;
    const units = Object.keys(unitData[type].units);

    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    units.forEach(unit => {
        fromUnit.appendChild(new Option(unit, unit));
        toUnit.appendChild(new Option(unit, unit));
    });

    // Set second unit as default "to"
    if (units.length > 1) toUnit.value = units[1];

    resultEl.innerText = "0";
}

// Convert unit
function convertUnit() {
    const value = parseFloat(document.getElementById("inputValue").value);
    const from = fromUnit.value;
    const to = toUnit.value;
    const type = typeSelect.value;

    if (isNaN(value)) {
        resultEl.innerText = "Enter a valid value";
        return;
    }

    let result;

    if (type === "temperature") {
        result = convertTemperature(value, from, to);
    } else {
        // Generic conversion: value -> base unit -> target unit
        const fromFactor = unitData[type].units[from];
        const toFactor = unitData[type].units[to];
        const baseValue = value * fromFactor;
        result = baseValue / toFactor;
    }

    // Format result based on size
    if (Math.abs(result) >= 1000000 || (Math.abs(result) < 0.001 && result !== 0)) {
        resultEl.innerText = result.toExponential(6) + " " + to;
    } else {
        resultEl.innerText = parseFloat(result.toFixed(8)) + " " + to;
    }
}

// Temperature conversion (special case - not multiplicative)
function convertTemperature(value, from, to) {
    if (from === to) return value;

    // Convert to Celsius first
    let celsius;
    switch (from) {
        case "Celsius": celsius = value; break;
        case "Fahrenheit": celsius = (value - 32) * 5 / 9; break;
        case "Kelvin": celsius = value - 273.15; break;
    }

    // Convert from Celsius to target
    switch (to) {
        case "Celsius": return celsius;
        case "Fahrenheit": return (celsius * 9 / 5) + 32;
        case "Kelvin": return celsius + 273.15;
    }
}

// Event listeners
typeSelect.addEventListener("change", updateUnits);

// Auto-convert on input change
document.getElementById("inputValue").addEventListener("input", () => {
    if (document.getElementById("inputValue").value) {
        convertUnit();
    }
});

fromUnit.addEventListener("change", () => {
    if (document.getElementById("inputValue").value) convertUnit();
});

toUnit.addEventListener("change", () => {
    if (document.getElementById("inputValue").value) convertUnit();
});

// Initialize
document.addEventListener("DOMContentLoaded", updateUnits);
