const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const points = [];
const lines = [];
const maxLines = 4;
let drawing = false;
let lastPoint = null;
let drawTimeout;

const gridSize = 3;
const cellSize = canvas.width / (gridSize + 1);

function createPoints() {
    points.length = 0;
    for (let row = 1; row <= gridSize; row++) {
        for (let col = 1; col <= gridSize; col++) {
            points.push({
                x: col * cellSize,
                y: row * cellSize,
                crossed: false
            });
        }
    }
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => {
        ctx.fillStyle = point.crossed ? 'green' : 'black';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawLine(from, to, solid = false) {
    ctx.setLineDash(solid ? [] : [10, 10]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    if (solid) checkCrossedPoints(from, to);
}

function checkCrossedPoints(from, to) {
    points.forEach(point => {
        const distToLine = Math.abs((to.y - from.y) * point.x - (to.x - from.x) * point.y + to.x * from.y - to.y * from.x) / 
            Math.sqrt(Math.pow(to.y - from.y, 2) + Math.pow(to.x - from.x, 2));
        if (distToLine < 10) {
            point.crossed = true;
        }
    });
}

function checkWinCondition() {
    if (lines.length === maxLines) {
        alert('Puzzle completed! Check if all points are connected.');
    }
}

function getTouchPos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (event) => {
    handleStart(event.clientX, event.clientY);
});

canvas.addEventListener('touchstart', (event) => {
    const pos = getTouchPos(event);
    handleStart(pos.x, pos.y);
    event.preventDefault();
});

function handleStart(x, y) {
    if (lines.length >= maxLines) return;
    lastPoint = { x, y };
    drawing = true;
}

canvas.addEventListener('mousemove', (event) => {
    handleMove(event.clientX, event.clientY);
});

canvas.addEventListener('touchmove', (event) => {
    const pos = getTouchPos(event);
    handleMove(pos.x, pos.y);
    event.preventDefault();
});

function handleMove(x, y) {
    if (!drawing) return;
    drawPoints();
    lines.forEach(line => drawLine(line.from, line.to, true));
    drawLine(lastPoint, { x, y });
}

canvas.addEventListener('mouseup', (event) => {
    handleEnd(event.clientX, event.clientY);
});

canvas.addEventListener('touchend', (event) => {
    const pos = getTouchPos(event);
    handleEnd(pos.x, pos.y);
    event.preventDefault();
});

function handleEnd(x, y) {
    if (!drawing) return;
    drawing = false;
    drawLine(lastPoint, { x, y }, true);
    lines.push({ from: lastPoint, to: { x, y } });
    lastPoint = { x, y }; // Allow the next line to start from the endpoint
    drawPoints();
    checkWinCondition();
}

createPoints();
drawPoints();