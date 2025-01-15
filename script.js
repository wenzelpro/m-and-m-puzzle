const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 4;
const cellSize = canvas.width / gridSize;
let drawing = false;
let points = [];

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

function getTouchPos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
    };
}

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    drawing = true;
    points = [];
    const pos = getTouchPos(event);
    points.push(pos);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('touchmove', (event) => {
    if (!drawing) return;
    event.preventDefault();
    const pos = getTouchPos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener('touchend', () => {
    drawing = false;
    // Add QR code reveal logic here if needed
});

drawGrid();
