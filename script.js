/**
 * NeuralSnake | Hamiltonian Shortcut Edition
 * Guaranteed to reach max score without self-collision.
 */

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// State Variables
let snake = [];
let food = { x: 5, y: 5 };
let score = 0;
let highScore = 0;
let gameInterval;
let isPaused = false;
let isGameOver = false;
let tickRate = 50; 
let currentPath = [];

// Hamiltonian Path Logic
let cycle = []; // The ordered list of coordinates
let gridIndices = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

/**
 * Generates a standard S-curve Hamiltonian Cycle for the grid.
 * This acts as the "safety rail" for the snake.
 */
function generateCycle() {
    cycle = [];
    // Zig-zag through columns 0 to 19, but leave row 0 for the return trip
    for (let x = 0; x < GRID_SIZE; x++) {
        if (x % 2 === 0) {
            for (let y = 1; y < GRID_SIZE; y++) cycle.push({x, y});
        } else {
            for (let y = GRID_SIZE - 1; y >= 1; y--) cycle.push({x, y});
        }
    }
    // Return to start (0,1) via the top row (row 0)
    for (let x = GRID_SIZE - 1; x >= 0; x--) {
        cycle.push({x, y: 0});
    }

    // Map coordinates to their index in the cycle for O(1) distance calculation
    cycle.forEach((pos, index) => {
        gridIndices[pos.y][pos.x] = index;
    });
}

function initGame() {
    generateCycle();
    
    // Start with a small snake following the first 3 points of the cycle
    snake = [
        {...cycle[2]}, 
        {...cycle[1]}, 
        {...cycle[0]}
    ];
    
    score = 0;
    isGameOver = false;
    document.getElementById('score').textContent = score;
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('strategyType').textContent = "System Initialized";
    
    spawnFood();
    
    if (gameInterval) clearInterval(gameInterval);
    if (!isPaused) startGameLoop();
    draw();
}

function startGameLoop() {
    gameInterval = setInterval(gameStep, tickRate);
}

function spawnFood() {
    // Only spawn food on tiles not occupied by the snake
    let possible = cycle.filter(p => !snake.some(s => s.x === p.x && s.y === p.y));
    
    if (possible.length === 0) {
        victory();
        return;
    }
    
    food = possible[Math.floor(Math.random() * possible.length)];
}

/**
 * Calculates distance between two points along the Hamiltonian cycle
 */
function getCycleDist(a, b) {
    let idxA = gridIndices[a.y][a.x];
    let idxB = gridIndices[b.y][b.x];
    if (idxB < idxA) return (cycle.length - idxA) + idxB;
    return idxB - idxA;
}

/**
 * AI BRAIN: Determines the next move.
 * Uses the Hamiltonian Cycle as a safety net but cuts corners when safe.
 */
function decideMove() {
    let head = snake[0];
    let tail = snake[snake.length - 1];
    let headIdx = gridIndices[head.y][head.x];
    
    // Default: Move to the next point in the cycle
    let nextIdx = (headIdx + 1) % cycle.length;
    let bestMove = cycle[nextIdx];
    let strategy = "Following Rail";

    // Shortcut Logic
    let neighbors = [
        {x: head.x + 1, y: head.y}, {x: head.x - 1, y: head.y},
        {x: head.x, y: head.y + 1}, {x: head.x, y: head.y - 1}
    ];
    
    let tailDistInCycle = getCycleDist(head, tail);

    neighbors.forEach(n => {
        // Must be within grid
        if (n.x < 0 || n.x >= GRID_SIZE || n.y < 0 || n.y >= GRID_SIZE) return;
        
        let nDistFromHead = getCycleDist(head, n);
        
        // RULE: A shortcut is only allowed if we leave enough space 
        // for the snake body + a 2-tile safety buffer.
        if (nDistFromHead < tailDistInCycle - 2) {
            // If this neighbor is "ahead" of our current best move relative to the food, take it.
            if (getCycleDist(n, food) < getCycleDist(bestMove, food)) {
                bestMove = n;
                strategy = "Shortcut (A*)";
            }
        }
    });

    document.getElementById('strategyType').textContent = strategy;
    document.getElementById('pathLength').textContent = getCycleDist(bestMove, food);
    return bestMove;
}

function gameStep() {
    if (isPaused || isGameOver) return;
    
    const next = decideMove();
    const eating = (next.x === food.x && next.y === food.y);
    
    // Self-collision/Wall check (Should never trigger with this logic)
    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE ||
        snake.some((s, i) => i !== snake.length - 1 && s.x === next.x && s.y === next.y)) {
        gameOver();
        return;
    }

    snake.unshift(next);
    
    if (eating) {
        score += 10;
        document.getElementById('score').textContent = score;
        document.getElementById('targetStatus').textContent = "Food Detected";
        spawnFood();
    } else {
        snake.pop();
        document.getElementById('targetStatus').textContent = "Scanning...";
    }
    
    draw();
}

function draw() {
    // Clear background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Subtle Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for(let i=0; i<=GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i*CELL_SIZE); ctx.lineTo(canvas.width, i*CELL_SIZE); ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(food.x * CELL_SIZE + 10, food.y * CELL_SIZE + 10, 7, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#10b981' : '#34d399';
        ctx.beginPath();
        // Drawing segments with rounded corners
        ctx.roundRect(s.x * CELL_SIZE + 1, s.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
        ctx.fill();
    });
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
    }
    document.getElementById('overlayMessage').textContent = "System Fault";
    document.getElementById('overlay').classList.remove('hidden');
}

function victory() {
    clearInterval(gameInterval);
    isGameOver = true;
    document.getElementById('overlayMessage').textContent = "System Maximized";
    document.getElementById('overlay').classList.remove('hidden');
}

// UI Controllers
document.getElementById('pauseBtn').onclick = () => {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        document.getElementById('stepBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = "Resume Simulation";
    } else {
        startGameLoop();
        document.getElementById('stepBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = "Pause Simulation";
    }
};

document.getElementById('stepBtn').onclick = () => {
    if (isPaused && !isGameOver) gameStep();
};

document.getElementById('restartBtn').onclick = initGame;

document.getElementById('speedSlider').oninput = (e) => {
    // We invert the value so right is fast, left is slow
    const val = parseInt(e.target.value);
    tickRate = 210 - val; 
    if (!isPaused && !isGameOver) {
        clearInterval(gameInterval);
        startGameLoop();
    }
};

// Start the simulation
initGame();