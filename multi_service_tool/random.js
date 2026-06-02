// Random Data Generator - Enhanced with more types

function generateData() {
    const type = document.getElementById("dataType").value;
    const length = parseInt(document.getElementById("dataLength").value) || 10;
    const result = document.getElementById("dataResult");

    let output = "";

    switch (type) {
        case "url": {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            let path = "";
            for (let i = 0; i < length; i++) {
                path += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const tlds = [".com", ".org", ".net", ".io", ".dev", ".app"];
            const tld = tlds[Math.floor(Math.random() * tlds.length)];
            output = `https://www.${path.substring(0, 8)}${tld}/${path}`;
            break;
        }
        case "string": {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                output += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            break;
        }
        case "number": {
            output = Math.floor(Math.random() * length) + 1;
            break;
        }
        case "uuid": {
            output = generateUUID();
            break;
        }
        case "password": {
            const lower = "abcdefghijklmnopqrstuvwxyz";
            const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const nums = "0123456789";
            const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
            const all = lower + upper + nums + special;

            // Ensure at least one of each
            output += lower[Math.floor(Math.random() * lower.length)];
            output += upper[Math.floor(Math.random() * upper.length)];
            output += nums[Math.floor(Math.random() * nums.length)];
            output += special[Math.floor(Math.random() * special.length)];

            for (let i = 4; i < Math.max(length, 8); i++) {
                output += all[Math.floor(Math.random() * all.length)];
            }

            // Shuffle the password
            output = output.split("").sort(() => Math.random() - 0.5).join("");
            break;
        }
        case "hex": {
            for (let i = 0; i < Math.max(length, 1); i++) {
                const hex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
                output += (i > 0 ? "\n" : "") + hex;
            }
            break;
        }
    }

    result.value = output;
}

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function copyData() {
    const result = document.getElementById("dataResult");
    if (!result.value) {
        showCopyToast("Nothing to copy! Generate data first.", "error");
        return;
    }

    // Use modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(result.value).then(() => {
            showCopyToast("Copied to clipboard!", "success");
        }).catch(() => {
            fallbackCopy(result);
        });
    } else {
        fallbackCopy(result);
    }
}

function fallbackCopy(element) {
    element.select();
    element.setSelectionRange(0, 99999);
    document.execCommand("copy");
    showCopyToast("Copied to clipboard!", "success");
}

function showCopyToast(message, type) {
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
    }, 2000);
}
