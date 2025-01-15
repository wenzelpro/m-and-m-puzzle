const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const points = [];
const lines = [];
const maxLines = 4;
let drawing = false;
let lastPoint = null;

const gridSize = 3;
const cellSize = canvas.width / (gridSize + 1);

function createPoints() {
    points.length = 0;
    for (let row = 1; row <= gridSize; row++) {
        for (let col = 1; col <= gridSize; col++) {
            points.push({
                x: col * cellSize,
                y: row * cellSize
            });
        }
    }
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function getClosestPoint(pos) {
    return points.find(point => {
        const dx = point.x - pos.x;
        const dy = point.y - pos.y;
        return Math.sqrt(dx * dx + dy * dy) < 15;
    });
}

function drawLine(from, to, solid = false) {
    ctx.setLineDash(solid ? [] : [10, 10]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function checkWinCondition() {
    if (lines.length === maxLines) {
        alert('Puzzle completed! Check if all points are connected.');
    }
}

canvas.addEventListener('mousedown', (event) => {
    if (lines.length >= maxLines) return;
    const rect = canvas.getBoundingClientRect();
    const pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
    const point = getClosestPoint(pos);
    if (point) {
        drawing = true;
        lastPoint = point;
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing || lines.length >= maxLines) return;
    const rect = canvas.getBoundingClientRect();
    const pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
    drawPoints();
    lines.forEach(line => drawLine(line.from, line.to, true));
    drawLine(lastPoint, pos);
});

canvas.addEventListener('mouseup', (event) => {
    if (!drawing || lines.length >= maxLines) return;
    drawing = false;
    const rect = canvas.getBoundingClientRect();
    const pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
    const point = getClosestPoint(pos);
    if (point && point !== lastPoint) {
        lines.push({ from: lastPoint, to: point });
        drawPoints();
        lines.forEach(line => drawLine(line.from, line.to, true));
        checkWinCondition();
    }
});

createPoints();
drawPoints();
