const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Paddle objects
const player = {
  x: PLAYER_X,
  y: (canvas.height - PADDLE_HEIGHT) / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#4fc3f7"
};

const ai = {
  x: AI_X,
  y: (canvas.height - PADDLE_HEIGHT) / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#f06292"
};

// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  vy: BALL_SPEED * (Math.random() * 2 - 1),
  radius: BALL_RADIUS,
  color: "#fff"
};

// Scores
let playerScore = 0;
let aiScore = 0;

// Draw the paddles, ball, and scores
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Middle line
  ctx.strokeStyle = "#444";
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  drawRect(player);
  drawRect(ai);

  // Draw ball
  drawBall(ball);

  // Draw scores
  ctx.fillStyle = "#fff";
  ctx.font = "bold 42px Arial";
  ctx.fillText(playerScore, canvas.width / 4 - 16, 60);
  ctx.fillText(aiScore, 3 * canvas.width / 4 - 16, 60);
}

function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

// Update game state
function update() {
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Bounce off top/bottom
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  } else if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= -1;
  }

  // Player paddle collision
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.x - ball.radius > player.x &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.x = player.x + player.width + ball.radius; // reposition to avoid stuck
    ball.vx *= -1.08; // bounce and slightly increase speed
    ball.vy += (ball.y - (player.y + player.height / 2)) * 0.15;
  }

  // AI paddle collision
  if (
    ball.x + ball.radius > ai.x &&
    ball.x + ball.radius < ai.x + ai.width &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.height
  ) {
    ball.x = ai.x - ball.radius; // reposition to avoid stuck
    ball.vx *= -1.08;
    ball.vy += (ball.y - (ai.y + ai.height / 2)) * 0.15;
  }

  // Left/right wall - score!
  if (ball.x - ball.radius < 0) {
    aiScore++;
    resetBall();
  }
  if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI movement (simple)
  if (ai.y + ai.height / 2 < ball.y - 10) {
    ai.y += PADDLE_SPEED * 0.85;
  } else if (ai.y + ai.height / 2 > ball.y + 10) {
    ai.y -= PADDLE_SPEED * 0.85;
  }
  // Keep AI in bounds
  ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Reset ball to center
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Player paddle movement with mouse
canvas.addEventListener('mousemove', function (e) {
  // Mouse position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  player.y = mouseY - player.height / 2;
  // Keep in bounds
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Main game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start the game
loop();