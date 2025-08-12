// --- Inicialização Canvas ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let groundY = canvas.height - 200;

// --- Fundo ---
let bgImage = new Image();
bgImage.src = "/Background/background.jpg";

let bgX = 0;
let bgSpeed = 2;

// --- Controle das telas ---
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const pauseScreen = document.getElementById("pauseScreen");
const modal = document.getElementById("gameOverModal");
const finalScoreText = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

// --- Variáveis de controle ---
let animationFrameId = null;
let score = 0;
let gameOver = false;
let paused = false;

var player, playerController;
let obstacles = [];

// --- Inicializa o jogo ---
function initGame() {
  score = 0;
  gameOver = false;
  paused = false;

  player = new Player(100, groundY, groundY + 120); // x = 100, y = groundY
  playerController = new PlayerController(player, canvas);

  obstacles = [];
  spawnObstacle();
}

// --- Função para spawnar obstáculo ---
function spawnObstacle() {
  // Garante distância mínima de 200px do último obstáculo
  if (obstacles.length > 0) {
    let lastObstacle = obstacles[obstacles.length - 1];
    if (lastObstacle.x + lastObstacle.width > canvas.width - 200) {
      return; // Não spawna se o último obstáculo está muito perto
    }
  }
  let newObstacle = new Obstacle(canvas.width, groundY + 40, 30, 30);
  newObstacle.speedX = Math.min(4 + score * 0.05, 12); // aumenta com score
  obstacles.push(newObstacle);
}

// --- Loop principal ---
function gameLoop() {
  if (gameOver || paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo com parallax
  ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);
  bgX -= bgSpeed;
  if (bgX <= -canvas.width) bgX = 0;

  // Player
  player.update();
  player.draw(ctx);

  // Obstáculos
  obstacles.forEach((obstacle, index) => {
    obstacle.update();
    obstacle.draw(ctx);

    // Colisão
    if (obstacle.checkCollision(player)) {
      gameOver = true;
      finalScoreText.textContent = "Sua pontuação: " + score;
      modal.style.display = "flex";
    }

    // Pontuação ao passar
    if (!obstacle.passedPlayer && obstacle.x + obstacle.width < player.x) {
      score++;
      obstacle.passedPlayer = true;
    }

    // Remover obstáculos fora da tela
    if (obstacle.isOffScreen()) {
      obstacles.splice(index, 1);
    }
  });

  // Spawn aleatório de novos obstáculos
  if (Math.random() < 0.02 && obstacles.length < 3) {
    spawnObstacle();
  }

  // Mostrar score
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  animationFrameId = requestAnimationFrame(gameLoop);
}

// --- Eventos ---
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  initGame();
  animationFrameId = requestAnimationFrame(gameLoop);
});

restartButton.addEventListener("click", () => {
  modal.style.display = "none";
  initGame();
  animationFrameId = requestAnimationFrame(gameLoop);
});

window.addEventListener("keydown", (e) => {
  if (e.code === "KeyP" && !gameOver && startScreen.style.display === "none") {
    paused = !paused;
    pauseScreen.style.display = paused ? "flex" : "none";

    if (!paused) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  }
});

// --- Espera imagem carregar para mostrar tela inicial ---
bgImage.onload = () => {
  startScreen.style.display = "flex";
  pauseScreen.style.display = "none";
  modal.style.display = "none";
};
