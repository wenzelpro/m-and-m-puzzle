const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 4;
const cellSize = canvas.width / gridSize;
let drawing = false;
let points = [];
let lastPoint = null;
let drawTimeout;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i <= gridSize; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
    }
    ctx.stroke();
}

drawGrid();

function getTouchPos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
    };
}

function snapToGrid(pos) {
    return {
        x: Math.round(pos.x / cellSize) * cellSize,
        y: Math.round(pos.y / cellSize) * cellSize
    };
}

function drawDashedLine(from, to) {
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function drawSolidLine(from, to) {
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function fillCell(pos) {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(pos.x - cellSize / 2, pos.y - cellSize / 2, cellSize, cellSize);
}

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    drawing = true;
    lastPoint = snapToGrid(getTouchPos(event));
    points.push(lastPoint);
});

canvas.addEventListener('touchmove', (event) => {
    if (!drawing) return;
    event.preventDefault();
    const currentPos = snapToGrid(getTouchPos(event));

    if (lastPoint && (currentPos.x !== lastPoint.x && currentPos.y !== lastPoint.y)) {
        return;
    }

    drawGrid();
    points.forEach((p, index) => {
        if (index > 0) {
            drawSolidLine(points[index - 1], p);
        }
    });
    drawDashedLine(lastPoint, currentPos);

    clearTimeout(drawTimeout);
    drawTimeout = setTimeout(() => {
        points.push(currentPos);
        drawSolidLine(lastPoint, currentPos);
        fillCell(currentPos);
        lastPoint = currentPos;
    }, 1000);
});

canvas.addEventListener('touchend', () => {
    clearTimeout(drawTimeout);
    drawing = false;
});
