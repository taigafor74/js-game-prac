document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 800;
  let lastTime = 0;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemyTypes = ["worm", "ghost", "spider"];
      this.enemies = [];
      this.#addNewEnemy();
      this.enemyInterval = 300;
      this.enemtTimer = 0;
    }
    update(deltaTime) {
      this.enemies.filter((item) => !item.markDelete);
      if (this.enemtTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemtTimer = 0;
      } else {
        this.enemtTimer += deltaTime;
      }
      this.enemies.forEach((item) => item.update(deltaTime));
    }
    draw() {
      this.enemies.forEach((item) => item.draw(this.ctx));
    }
    #addNewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randomEnemy == "worm") this.enemies.push(new Worm(this));
      else if (randomEnemy == "ghost") this.enemies.push(new Ghost(this));
      else if (randomEnemy == "spider") this.enemies.push(new Spider(this));
      this.enemies.sort(function (a, b) {
        return a.y - b.y;
      });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markDelete = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;
      if (this.x + this.width < 0) this.markDelete = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHieght,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHieght = 171;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHieght / 2;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }
  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHieght = 209;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHieght / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = ghost;
      this.angle = 0;
      this.vx = Math.random() * 0.2 + 0.1;
      this.curve = Math.random() * 3;
    }
    update(deltaTime) {
      super.update(deltaTime);
      if (this.y + this.height * 2 < 0) this.markDelete = true;
      this.y += Math.sin(this.angle) * this.curve;

      this.angle += 0.04;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = 0.2;
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHieght = 175;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHieght / 2;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.image = spider;
      // this.vx = Math.random() * 0.1 + 0.1;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * this.game.height;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += this.vy * deltaTime;
      if (this.y > this.maxLength) this.vy *= -1;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, 0);
      ctx.lineTo(this.x + this.width / 2, this.y);
      ctx.stroke();
      super.draw(ctx);
    }
  }
  const game = new Game(ctx, canvas.width, canvas.height);
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }
  animate(0);
});
