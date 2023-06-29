// Initial direction of the snake
let snakeDirection = "right";

// Game settings
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 200; // in milliseconds
const FOOD_COLOR = "red";
const SNAKE_COLOR = "green";

// Game state
let gameBoard;
let snake;
let food;
let score;
let speed;
let level;
let gameLoop;

// Initialize game
function init() {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    gameBoard = createGameBoard(canvas.width, canvas.height);
    snake = createSnake();
    food = generateFood();
    score = 0;
    speed = INITIAL_SPEED;
    level = 1;

    document.addEventListener("keydown", handleKeyPress);

    gameLoop = setInterval(updateGame, speed);
}

// Create initial game board
function createGameBoard(width, height) {
    const columns = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);

    const gameBoard = [];

    for (let y = 0; y < rows; y++) {
        gameBoard[y] = [];

        for (let x = 0; x < columns; x++) {
            gameBoard[y][x] = null;
        }
    }

    return gameBoard;
}

// Create initial snake
function createSnake() {
    const startX = Math.floor(gameBoard[0].length / 2);
    const startY = Math.floor(gameBoard.length / 2);

    const snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
    ];

    return snake;
}

// Generate food at a random position
function generateFood() {
    let foodPosition;

    do {
        const x = Math.floor(Math.random() * gameBoard[0].length);
        const y = Math.floor(Math.random() * gameBoard.length);

        foodPosition = { x, y };
    } while (isSnakeColliding(foodPosition));

    return foodPosition;
}

// Check if the snake collides with a given position
function isSnakeColliding(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

// Handle key presses
function handleKeyPress(event) {
    const key = event.key;

    if (key === "ArrowUp" && snakeDirection !== "down") {
        snakeDirection = "up";
    } else if (key === "ArrowDown" && snakeDirection !== "up") {
        snakeDirection = "down";
    } else if (key === "ArrowLeft" && snakeDirection !== "right") {
        snakeDirection = "left";
    } else if (key === "ArrowRight" && snakeDirection !== "left") {
        snakeDirection = "right";
    }
}

// Update game state
function updateGame() {
    moveSnake();

    if (isSnakeColliding(food)) {
        snake.push({ ...food });
        food = generateFood();
        score++;

        if (score === 10) {
            level++;
            speed *= 0.9; // Increase speed for each level
            clearInterval(gameLoop);
            gameLoop = setInterval(updateGame, speed);
        }

        updateScoreAndLevel();
    }

    if (isGameOver()) {
        clearInterval(gameLoop);
        alert("Game Over! Your score: " + score);
        location.reload(); // Restart the game
    }

    renderGame();
}

// Move the snake
function moveSnake() {
    const head = { ...snake[0] };

    if (snakeDirection === "up") {
        head.y--;
    } else if (snakeDirection === "down") {
        head.y++;
    } else if (snakeDirection === "left") {
        head.x--;
    } else if (snakeDirection === "right") {
        head.x++;
    }

    snake.unshift(head);
    snake.pop();
}

// Check if the game is over
function isGameOver() {
    const head = snake[0];

    // Check for collisions with walls
    if (head.x < 0 || head.x >= gameBoard[0].length || head.y < 0 || head.y >= gameBoard.length) {
        return true;
    }

    // Check for collisions with the snake's body
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Update score and level
function updateScoreAndLevel() {
    const scoreElement = document.getElementById("score");
    const levelElement = document.getElementById("level");

    scoreElement.textContent = "Score: " + score;

    if (level <= 3) {
        levelElement.textContent = "Level: " + level;
    } else {
        levelElement.textContent = "Max Level Reached!";
    }
}

// Render the game on the canvas
function renderGame() {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Render food
    context.fillStyle = FOOD_COLOR;
    context.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Render snake
    context.fillStyle = SNAKE_COLOR;
    snake.forEach(segment => {
        context.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
}

// Start the game
init();
