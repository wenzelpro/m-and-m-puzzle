const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

// Define star points (hexagram)
const points = [
    { x: 250, y: 50 },  // Top
    { x: 400, y: 150 }, // Top-right
    { x: 350, y: 350 }, // Bottom-right
    { x: 250, y: 450 }, // Bottom
    { x: 150, y: 350 }, // Bottom-left
    { x: 100, y: 150 }  // Top-left
];

let drawnPath = [];      // To store user path
let isDrawing = false;   // Control line drawing

// Draw the star points
function drawStar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Start drawing on mouse down
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    drawnPath = [];
    drawnPath.push(getMousePosition(e));
});

// Draw the line while dragging
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const pos = getMousePosition(e);
    drawnPath.push(pos);
    redrawCanvas();
});

// Stop drawing and check the solution
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    if (checkSolution()) {
        document.getElementById("qrCodeContainer").style.display = "block";
    } else {
        alert("Try again! Make sure to pass through all points.");
        drawStar();
    }
});

// Helper: Get mouse position relative to canvas
function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Redraw the canvas with the drawn line
function redrawCanvas() {
    drawStar();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(drawnPath[0].x, drawnPath[0].y);
    drawnPath.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
}

// Check if the drawn path is a valid star
function checkSolution() {
    let visitedPoints = new Set();
    points.forEach((point, index) => {
        for (let i = 0; i < drawnPath.length; i++) {
            const dist = Math.hypot(point.x - drawnPath[i].x, point.y - drawnPath[i].y);
            if (dist < 15) { // Close enough to count as a hit
                visitedPoints.add(index);
                break;
            }
        }
    });
    return visitedPoints.size === points.length;
}

drawStar();
