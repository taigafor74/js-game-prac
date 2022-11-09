window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        console.log(e);
        if (
          (e.key === "s" || e.key === "w" || e.key === "a" || e.key === "d") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === "s" || e.key === "w" || e.key === "a" || e.key === "d") {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.framey = 0;
      this.maxFrame = 8;
      this.image = playerImage;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      this.fps = 30;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
    }
    draw(context) {
      // context.strokeStyle = "white";
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2,
      //   this.y + this.height / 2,
      //   this.width / 2,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
      // context.beginPath();
      // context.strokeStyle = "blue";
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();

      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.framey * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, enemies) {
      enemies.forEach((item) => {
        const dx = item.x + item.width / 2 - (this.x + this.width / 2);
        const dy = item.y + item.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < item.width / 2 + this.width / 2) {
          gameOver = true;
        }
      });

      if (this.frameTimer > this.frameInterval) {
        if (this.frameX > this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      if (input.keys.indexOf("d") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("a") > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf("w") > -1 && this.onGround()) {
        this.vy -= 30;
      } else {
        this.speed = 0;
      }
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.gameWidth) {
        this.x = this.gameWidth - this.width;
      }
      this.x += this.speed;
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.framey = 1;
        this.maxFrame = 5;
      } else {
        this.vy = 0;
        this.framey = 0;
        this.maxFrame = 7;
      }
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }
  class BackGround {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = bakgroundImage;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 5;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }
  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = enemyImage;
      this.width = 160;
      this.height = 119;
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.speed = 8;
      this.maxFrame = 4;
      this.fps = 30;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.markDelete = false;
    }
    draw(context) {
      // context.strokeStyle = "white";
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2,
      //   this.y + this.height / 2,
      //   this.width / 2,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
      // context.beginPath();
      // context.strokeStyle = "blue";
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX > this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markDelete = true;
      }
    }
  }
  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomInterval = Math.random() * 1000 + 500;
  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const backGround = new BackGround(canvas.width, canvas.height);
  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomInterval) {
      score++;
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((item) => {
      item.draw(ctx);
      item.update(deltaTime);
    });
    enemies.filter((item) => {
      return !item.markDelete;
    });
  }
  function displayStatusText() {
    ctx.fillStyle = "black";
    ctx.font = "40px Helvetica";
    ctx.fillText("Score: " + score, 20, 50);
    ctx.fillStyle = "white";
    ctx.font = "40px Helvetica";
    ctx.fillText("Score: " + score, 22, 52);

    if (gameOver) {
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("Game Over,Try Again!!", canvas.width / 2, 100);
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText("Game Over,Try Again!!", canvas.width / 2 + 2, 100);
    }
  }

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backGround.draw(ctx);
    displayStatusText();
    backGround.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    if (!gameOver) requestAnimationFrame(animate);
    displayStatusText();
  }
  animate(0);
});
