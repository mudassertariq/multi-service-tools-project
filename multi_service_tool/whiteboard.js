// Online Whiteboard with Touch Support, Undo, and Eraser

const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
let painting = false;
let isEraser = false;
let history = [];

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraserBtn");

// Save current canvas state to history
function saveState() {
    history.push(canvas.toDataURL());
    // Keep history manageable
    if (history.length > 50) history.shift();
}

// Resize canvas for responsive
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = container.clientWidth - 40; // padding
    const ratio = 500 / 800;

    if (maxWidth < 800) {
        canvas.style.width = maxWidth + "px";
        canvas.style.height = (maxWidth * ratio) + "px";
    } else {
        canvas.style.width = "800px";
        canvas.style.height = "500px";
    }
}

// Get position from mouse or touch event
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// Start drawing
function startDrawing(e) {
    e.preventDefault();
    painting = true;
    saveState();
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Stop drawing
function stopDrawing(e) {
    if (e) e.preventDefault();
    painting = false;
    ctx.beginPath();
}

// Draw
function draw(e) {
    if (!painting) return;
    e.preventDefault();

    const pos = getPosition(e);

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isEraser) {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = colorPicker.value;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Touch events
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchend", stopDrawing, { passive: false });
canvas.addEventListener("touchcancel", stopDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });

// Toggle eraser
function toggleEraser() {
    isEraser = !isEraser;
    eraserBtn.style.background = isEraser ? "#38bdf8" : "";
    eraserBtn.style.color = isEraser ? "#020617" : "#38bdf8";
    eraserBtn.textContent = isEraser ? "Drawing" : "Eraser";
}

// Undo last action
function undoAction() {
    if (history.length === 0) return;

    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 0, 0);
    };
    img.src = history.pop();
}

// Clear canvas
function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
}

// Save canvas as image
function saveCanvas() {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Resize on load and window resize
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);
