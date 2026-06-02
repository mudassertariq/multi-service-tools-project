const passwordInput = document.getElementById("passwordInput");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const rules = {
    length: document.getElementById("rule-length"),
    upper: document.getElementById("rule-upper"),
    lower: document.getElementById("rule-lower"),
    number: document.getElementById("rule-number"),
    special: document.getElementById("rule-special")
};

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    let strength = 0;

    // Length
    if (password.length >= 8) {
        strength++;
        rules.length.style.color = "lightgreen";
    } else {
        rules.length.style.color = "red";
    }

    // Uppercase
    if (/[A-Z]/.test(password)) {
        strength++;
        rules.upper.style.color = "lightgreen";
    } else {
        rules.upper.style.color = "red";
    }

    // Lowercase
    if (/[a-z]/.test(password)) {
        strength++;
        rules.lower.style.color = "lightgreen";
    } else {
        rules.lower.style.color = "red";
    }

    // Number
    if (/[0-9]/.test(password)) {
        strength++;
        rules.number.style.color = "lightgreen";
    } else {
        rules.number.style.color = "red";
    }

    // Special character
    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
        rules.special.style.color = "lightgreen";
    } else {
        rules.special.style.color = "red";
    }

    // Update strength bar
    const percent = (strength / 5) * 100;
    strengthBar.style.width = percent + "%";

    if (strength <= 2) {
        strengthBar.style.background = "red";
        strengthText.innerText = "Strength: Weak";
    } else if (strength === 3 || strength === 4) {
        strengthBar.style.background = "orange";
        strengthText.innerText = "Strength: Medium";
    } else {
        strengthBar.style.background = "green";
        strengthText.innerText = "Strength: Strong";
    }
});

