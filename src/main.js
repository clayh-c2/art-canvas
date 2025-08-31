const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushSize");
const brushSizeValue = document.getElementById("brushSizeValue");
const clearButton = document.getElementById("clearCanvas");
const undoButton = document.getElementById("undoBtn");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

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
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseleave", () => (isDrawing = false));
