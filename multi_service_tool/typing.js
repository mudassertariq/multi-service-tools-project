// Typing Speed Tester JS

const typingInput = document.getElementById("typing-input");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const textToType = document.getElementById("text-to-type").innerText;

let startTime, interval;

function startTest() {
    typingInput.disabled = false;
    typingInput.value = "";
    typingInput.focus();
    startTime = new Date();
    if (interval) clearInterval(interval);
    interval = setInterval(updateTime, 1000);
}

function resetTest() {
    typingInput.value = "";
    typingInput.disabled = true;
    clearInterval(interval);
    timeDisplay.innerText = 0;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = 0;
}

function updateTime() {
    let currentTime = new Date();
    let seconds = Math.floor((currentTime - startTime) / 1000);
    timeDisplay.innerText = seconds;
    calculateResults();
}

function calculateResults() {
    const typedText = typingInput.value;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const timeInMinutes = (parseInt(timeDisplay.innerText) / 60) || 1/60; // Avoid division by zero
    const wpm = Math.floor(wordsTyped / timeInMinutes);
    wpmDisplay.innerText = isNaN(wpm) ? 0 : wpm;

    // Accuracy calculation
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === textToType[i]) correctChars++;
    }
    const accuracy = Math.floor((correctChars / textToType.length) * 100);
    accuracyDisplay.innerText = isNaN(accuracy) ? 0 : accuracy;
}

// Event Listeners
startBtn.addEventListener("click", startTest);
resetBtn.addEventListener("click", resetTest);

// Disable typing initially
typingInput.disabled = true;
