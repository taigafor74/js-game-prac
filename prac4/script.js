const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);
let canvasPosition = canvas.getBoundingClientRect();

const explosions = [];

class Explosions {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = "../assests/boom.png";
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
  }
  updated() {
    this.timer++;
    if (this.timer % 10 == 0) {
      this.frame++;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.img,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2,
      0 - this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
window.addEventListener("click", function (e) {
  createAnimation(e);
});
window.addEventListener("mousemove", function (e) {
  createAnimation(e);
});
function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  explosions.push(new Explosions(positionX, positionY));
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  explosions.forEach((item, index) => {
    item.updated();
    item.draw();
    if (item.frame > 5) {
      explosions.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}
animate();
