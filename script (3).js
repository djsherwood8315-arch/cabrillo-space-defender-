const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const startButton = document.getElementById("startButton");

let player, bullets, enemies;
let score = 0;
let lives = 3;
let running = false;
let keys = {};
let lastShot = 0;
let animationId;
let lastEnemy = 0;

function resetGame() {
  player = { x: 230, y: 480, width: 40, height: 40 };
  bullets = [];
  enemies = [];
  score = 0;
  lives = 3;
  lastShot = 0;
  lastEnemy = 0;

  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
}

document.addEventListener("keydown", e => {
  keys[e.code] = true;
  if (e.code === "Space") e.preventDefault();
});

document.addEventListener("keyup", e => {
  keys[e.code] = false;
});

function shoot() {
  bullets.push({
    x: player.x + 18,
    y: player.y,
    width: 4,
    height: 15
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * 460,
    y: -30,
    width: 40,
    height: 30,
    speed: 2 + Math.random() * 2
  });
}

function hit(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function update(time) {
  if (!running) return;

  if (keys.ArrowLeft) player.x -= 5;
  if (keys.ArrowRight) player.x += 5;

  player.x = Math.max(0, Math.min(460, player.x));

  if (keys.Space && time - lastShot > 250) {
    shoot();
    lastShot = time;
  }

  bullets.forEach(b => b.y -= 7);
  bullets = bullets.filter(b => b.y > -20);

  if (time - lastEnemy > 900) {
    spawnEnemy();
    lastEnemy = time;
  }

  enemies.forEach(e => e.y += e.speed);

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];

    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      lives--;
      continue;
    }

    if (hit(player, enemy)) {
      enemies.splice(i, 1);
      lives--;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (hit(bullets[i], enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;

  if (lives <= 0) {
    running = false;
    draw();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 250, 260);
    ctx.font = "18px Arial";
    ctx.fillText("CABRILLO COLLEGE", 250, 295);
    ctx.fillText("Final Score: " + score, 250, 325);
    startButton.textContent = "PLAY AGAIN";
  }
}

function draw() {
  ctx.fillStyle = "#080820";
  ctx.fillRect(0, 0, 500, 550);

  // Stars
  ctx.fillStyle = "white";
  for (let i = 0; i < 60; i++) {
    let x = (i * 83) % 500;
    let y = (i * 137) % 550;
    ctx.fillRect(x, y, 2, 2);
  }

  // Player spaceship
  ctx.fillStyle = "#00eaff";
  ctx.beginPath();
  ctx.moveTo(player.x + 20, player.y);
  ctx.lineTo(player.x, player.y + 40);
  ctx.lineTo(player.x + 40, player.y + 40);
  ctx.closePath();
  ctx.fill();

  // Laser bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // Enemy ships
  ctx.fillStyle = "#ff3355";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });
}

function gameLoop(time) {
  update(time);
  draw();

  if (running) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

startButton.addEventListener("click", () => {
  cancelAnimationFrame(animationId);
  resetGame();
  running = true;
  startButton.textContent = "RESTART GAME";
  requestAnimationFrame(gameLoop);
});

// Initial screen
resetGame();
draw();

ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.font = "25px Arial";
ctx.fillText("CABRILLO COLLEGE", 250, 245);
ctx.font = "17px Arial";
ctx.fillText("PRESS START TO PLAY", 250, 280);