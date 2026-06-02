// Tools Search Functionality
const searchBox = document.getElementById("searchBox");
const toolCards = document.querySelectorAll(".tool-card");

searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase();

    toolCards.forEach(card => {
        const toolName = card.querySelector("h3").innerText.toLowerCase();
        if (toolName.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});
