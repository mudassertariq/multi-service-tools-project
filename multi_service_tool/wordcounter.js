const textInput = document.getElementById("textInput");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const sentenceCount = document.getElementById("sentenceCount");

textInput.addEventListener("input", () => {
    const text = textInput.value.trim();

    // Word count
    const words = text === "" ? 0 : text.split(/\s+/).length;
    wordCount.innerText = words;

    // Character count (excluding spaces at end)
    charCount.innerText = text.length;

    // Sentence count
    const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    sentenceCount.innerText = sentences;
});

function clearText() {
    textInput.value = "";
    wordCount.innerText = 0;
    charCount.innerText = 0;
    sentenceCount.innerText = 0;
}
