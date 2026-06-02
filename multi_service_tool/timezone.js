// Time Zone Converter - Dynamic with all IANA Time Zones

const fromZoneSelect = document.getElementById("fromZone");
const toZoneSelect = document.getElementById("toZone");
const dateTimeInput = document.getElementById("dateTimeInput");
const timeResult = document.getElementById("timeResult");
const currentTimeDisplay = document.getElementById("currentTimeDisplay");

// Get all supported IANA time zones dynamically
function getAllTimezones() {
    // Use Intl API to get supported time zones
    if (typeof Intl.supportedValuesOf === "function") {
        return Intl.supportedValuesOf("timeZone");
    }

    // Fallback: comprehensive list of common time zones
    return [
        "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers",
        "Africa/Cairo", "Africa/Casablanca", "Africa/Johannesburg", "Africa/Lagos",
        "Africa/Nairobi", "Africa/Tunis",
        "America/Anchorage", "America/Argentina/Buenos_Aires", "America/Bogota",
        "America/Chicago", "America/Denver", "America/Edmonton", "America/Halifax",
        "America/Lima", "America/Los_Angeles", "America/Mexico_City", "America/New_York",
        "America/Phoenix", "America/Santiago", "America/Sao_Paulo", "America/St_Johns",
        "America/Toronto", "America/Vancouver", "America/Winnipeg",
        "Asia/Almaty", "Asia/Baghdad", "Asia/Bangkok", "Asia/Colombo", "Asia/Dhaka",
        "Asia/Dubai", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Istanbul",
        "Asia/Jakarta", "Asia/Jerusalem", "Asia/Kabul", "Asia/Karachi", "Asia/Kathmandu",
        "Asia/Kolkata", "Asia/Kuala_Lumpur", "Asia/Kuwait", "Asia/Manila", "Asia/Muscat",
        "Asia/Riyadh", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei",
        "Asia/Tashkent", "Asia/Tehran", "Asia/Tokyo",
        "Atlantic/Reykjavik",
        "Australia/Adelaide", "Australia/Brisbane", "Australia/Darwin", "Australia/Hobart",
        "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
        "Europe/Amsterdam", "Europe/Athens", "Europe/Berlin", "Europe/Brussels",
        "Europe/Bucharest", "Europe/Budapest", "Europe/Copenhagen", "Europe/Dublin",
        "Europe/Helsinki", "Europe/Istanbul", "Europe/Kiev", "Europe/Lisbon",
        "Europe/London", "Europe/Madrid", "Europe/Moscow", "Europe/Oslo",
        "Europe/Paris", "Europe/Prague", "Europe/Rome", "Europe/Stockholm",
        "Europe/Vienna", "Europe/Warsaw", "Europe/Zurich",
        "Pacific/Auckland", "Pacific/Fiji", "Pacific/Guam", "Pacific/Honolulu",
        "Pacific/Samoa",
        "UTC"
    ];
}

// Format timezone name for display
function formatTimezoneName(tz) {
    const parts = tz.split("/");
    const city = parts[parts.length - 1].replace(/_/g, " ");
    const region = parts[0];

    // Get current offset
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            timeZoneName: "shortOffset"
        });
        const formatted = formatter.format(now);
        const offset = formatted.split(", ").pop() || "";
        return `${region}/${city} (${offset})`;
    } catch {
        return tz;
    }
}

// Populate timezone dropdowns
function populateTimezones() {
    const timezones = getAllTimezones();

    fromZoneSelect.innerHTML = "";
    toZoneSelect.innerHTML = "";

    // Group by region
    const groups = {};
    timezones.forEach(tz => {
        const region = tz.split("/")[0] || "Other";
        if (!groups[region]) groups[region] = [];
        groups[region].push(tz);
    });

    Object.keys(groups).sort().forEach(region => {
        const optgroupFrom = document.createElement("optgroup");
        optgroupFrom.label = region;
        const optgroupTo = document.createElement("optgroup");
        optgroupTo.label = region;

        groups[region].forEach(tz => {
            const label = formatTimezoneName(tz);
            optgroupFrom.appendChild(new Option(label, tz));
            optgroupTo.appendChild(new Option(label, tz));
        });

        fromZoneSelect.appendChild(optgroupFrom);
        toZoneSelect.appendChild(optgroupTo);
    });

    // Detect user's timezone and set as default "From"
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (userTz) fromZoneSelect.value = userTz;
    else fromZoneSelect.value = "UTC";

    toZoneSelect.value = "America/New_York";
}

// Set current date/time as default
function setDefaultDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    dateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert time
function convertTime() {
    const dateTimeValue = dateTimeInput.value;
    const fromZone = fromZoneSelect.value;
    const toZone = toZoneSelect.value;

    if (!dateTimeValue) {
        timeResult.innerText = "Select date & time";
        return;
    }

    try {
        // Parse the input as a date in the source timezone
        const inputDate = new Date(dateTimeValue);

        // Format in source timezone
        const sourceFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: fromZone,
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            hour12: false
        });

        // Get the offset difference
        const sourceOffset = getTimezoneOffset(inputDate, fromZone);
        const targetOffset = getTimezoneOffset(inputDate, toZone);

        // Adjust time
        const adjustedTime = new Date(inputDate.getTime() - sourceOffset + targetOffset);

        // Format in target timezone - use the Intl API properly
        const targetFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: toZone,
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "short"
        });

        // Simply format the input date in the target timezone
        // The Intl API handles the conversion automatically
        const formatted = targetFormatter.format(inputDate);

        timeResult.innerText = formatted;

        // Show both times
        const sourceFormatted = new Intl.DateTimeFormat("en-US", {
            timeZone: fromZone,
            hour: "2-digit", minute: "2-digit",
            hour12: true, timeZoneName: "short"
        }).format(inputDate);

        currentTimeDisplay.innerHTML = `
            <strong>Source:</strong> ${sourceFormatted}<br>
            <strong>Target:</strong> ${formatted}
        `;

    } catch (error) {
        timeResult.innerText = "Conversion error";
        console.error("Time conversion error:", error);
    }
}

// Get timezone offset in milliseconds
function getTimezoneOffset(date, timezone) {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return tzDate - utcDate;
}

// Update current times for both zones
function updateCurrentTimes() {
    const now = new Date();
    const fromZone = fromZoneSelect.value;
    const toZone = toZoneSelect.value;

    if (fromZone && toZone) {
        const fromTime = now.toLocaleString("en-US", {
            timeZone: fromZone,
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            hour12: true
        });
        const toTime = now.toLocaleString("en-US", {
            timeZone: toZone,
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            hour12: true
        });

        currentTimeDisplay.innerHTML = `
            <strong>Current time:</strong><br>
            ${fromZone.split("/").pop().replace(/_/g, " ")}: ${fromTime}<br>
            ${toZone.split("/").pop().replace(/_/g, " ")}: ${toTime}
        `;
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    populateTimezones();
    setDefaultDateTime();
    updateCurrentTimes();
    setInterval(updateCurrentTimes, 1000);
});
