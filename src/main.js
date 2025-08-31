const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");

const brushSizeInput = document.getElementById("brushSize");
const brushSizeValue = document.getElementById("brushSizeValue");

const clearButton = document.getElementById("clearCanvas");

const undoButton = document.getElementById("undoBtn");
const redoButton = document.getElementById("redoBtn");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let history = [];
let historyIndex = -1;
const MAX_HISTORY = 50;

const setContextProperties = () => {
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSizeInput.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
};

const resizeCanvas = () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.putImageData(imageData, 0 , 0);
    setContextProperties();
};
resizeCanvas();

const draw = (e) => {
    if (!isDrawing) return;
    setContextProperties();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
};

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    saveHistory();
});
canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

brushSizeInput.addEventListener("input", (e) => {
    brushSizeValue.textContent = e.target.value;
});

clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
});

const updateButtons = () => {
    undoButton.disabled = historyIndex <= 0;
    redoButton.disabled = historyIndex >= history.length - 1;
};

const saveHistory = () => {
    history = history.slice(0, historyIndex + 1);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > MAX_HISTORY) {
        history.shift();
    } else {
        historyIndex++;
    }

    if (historyIndex >= history.length) {
        historyIndex = history.length - 1;
    }

    updateButtons();
};
saveHistory();

const applyHistory = () => {
    if (history[historyIndex]) {
        ctx.putImageData(history[historyIndex], 0, 0);
    }
};

const stepHistory = (direction) => {
    const newIndex = historyIndex + direction;
    if (newIndex >= 0 && newIndex < history.length) {
        historyIndex = newIndex;
        applyHistory();
        updateButtons();
    }
};

const undo = () => {
    stepHistory(-1);
};
const redo = () => {
    stepHistory(1);
};

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
//Allow undo and redo with Ctrl + z and Ctrl + y respectively
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && !e.shiftKey) {
        e.preventDefault();
        redo();
    }
});