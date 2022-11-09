const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
ctx.font = "50px Impact";
let ravens = [];
let gameover = false;
let explosions = [];
function init() {
  timeToNextRaven = 0;
  ravenInterval = 500;
  lastTime = 0;
  score = 0;
  ravens = [];
  gameover = false;
  explosions = [];
  animate(0);
}
function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 55, 80);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 50, 75);
}
window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  ravens.forEach((item) => {
    if (
      item.randomColors[0] === pc[0] &&
      item.randomColors[1] === pc[1] &&
      item.randomColors[2] === pc[2]
    ) {
      item.markDelete = true;
      score++;
      explosions.push(new Explosion(item.x, item.y, item.width));
    }
  });
});
class Explosion {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = new Image();
    this.markDelete = false;
    this.img.src = "../assests/boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.frame = 0;
    this.timeSinceLF = 0;
    this.frameInterval = 100;
  }
  update(deltatime) {
    this.timeSinceLF += deltatime;
    if (this.timeSinceLF > this.frameInterval) {
      this.frame++;
      this.timeSinceLF = 0;
      if (this.frame > 5) this.markDelete = true;
    }
  }
  draw() {
    ctx.drawImage(
      this.img,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markDelete = false;
    this.img = new Image();
    this.img.src = "../assests/raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY *= -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markDelete = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
    if (this.x < 0 - this.width) gameover = true;
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.img,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
window.addEventListener("keypress", function (e) {
  console.log(e);
  if (e.code == "Space") {
    gameover = false;
    score = 0;
    init();
  }
});
function drawgameover() {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    "GAME OVER,YOUR SCORE IS " + score + "  Press SPACE RESET",
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(
    "GAME OVER,YOUR SCORE IS " + score + "  Press SPACE RESET",
    canvas.width / 2 - 5,
    canvas.height / 2 - 5
  );
}
function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }

  [...ravens, ...explosions].forEach((item) => item.update(deltatime));
  [...ravens, ...explosions].forEach((item) => item.draw());
  ravens = ravens.filter((item) => !item.markDelete);
  explosions = explosions.filter((item) => !item.markDelete);
  if (!gameover) requestAnimationFrame(animate);
  else {
    drawgameover();
  }
}
animate(0);
