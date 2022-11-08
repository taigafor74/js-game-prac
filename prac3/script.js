/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);
const numberofEnemies = 40;
const enemiesArray = [];
let gameFrame = 0;
class Enemy {
  constructor() {
    this.enemyImage = new Image(); //
    this.enemyImage.src = "../assests/enemy/enemy2.png";
    // this.spriteWidth = 293;
    // this.spriteHeight = 155;
    this.spriteWidth = 266;
    this.spriteHeight = 1188;
    this.height = this.spriteHeight / 3;
    this.width = this.spriteWidth / 3;
    this.speed = Math.random() * 4 - 2;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.newx = Math.random() * (CANVAS_WIDTH - this.width);
    this.newy = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 0;
    // this.angle = Math.random() * 2;
    // this.angleSpeed = Math.random() * 0.2;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    // this.curve = Math.random() * 7;
    this.interval = Math.floor(Math.random() * 200 + 50);
  }
  updated() {
    this.speed = Math.random() * 1 - 2;
    if (gameFrame % this.interval == 0) {
      this.newx = Math.random() * (CANVAS_WIDTH - this.width);
      this.newy = Math.random() * (CANVAS_HEIGHT - this.height);
    }
    let dx = this.x - this.newx;
    let dy = this.y - this.newy;
    this.x -= dx / 80;
    this.y -= dy / 80;
    // if (this.x > CANVAS_WIDTH - this.width) {
    //   this.speed *= -1;
    // } else if (this.x < 0) {
    //   this.speed *= -1;
    // }
    // if (this.y > CANVAS_HEIGHT) {
    //   this.speed *= -1;
    // } else if (this.y < 0) {
    //   this.speed *= -1;
    // }
    // if (this.x + this.width < 0) this.x = canvas.width;
    // this.x += this.speed;
    // this.y += this.curve * Math.sin(this.angle);
    // this.angle += this.angleSpeed;
    if (gameFrame % this.flapSpeed == 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }
  draw() {
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.enemyImage,
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
for (let i = 0; i < numberofEnemies; i++) {
  enemiesArray.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach((item) => {
    item.updated();
    item.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
