function removeDuplicates() {
    const input = document.getElementById("inputText").value;
    const output = document.getElementById("outputText");

    if (input.trim() === "") {
        output.value = "Please enter some text.";
        return;
    }

    const lines = input.split("\n");
    const uniqueLines = [...new Set(lines)];

    output.value = uniqueLines.join("\n");
}

function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";
}
