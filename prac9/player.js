import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
export default class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.frameX = 0;
    this.frameY = 0;
    this.vy = 0;
    this.weight = 1.5;
    this.image = player;
    this.speed = 0;
    this.maxSpeed = 5;
    this.maxFrame = 5;
    this.fps = 30;
    this.timer = 0;
    this.timerY = 0;
    this.yInterval = 5;
    this.frameInterval = 1000 / this.fps;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    this.x += this.speed;
    if (input.includes("d")) this.speed = this.maxSpeed;
    else if (input.includes("a")) this.speed = -this.maxSpeed;
    else this.speed = 0;
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.y = this.game.height - this.height - this.game.groundMargin;
    }
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    if (this.timer > this.frameInterval) {
      this.timer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.timer += deltaTime;
    }
    if (this.timerY > this.yInterval) {
      this.timerY = 0;
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
      } else {
        this.vy = 0;
      }
    } else {
      this.timerY += deltaTime;
    }
  }
  draw(ctx) {
    if (this.game.debug) {
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        //发生碰撞
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
        if (
          this.currentState === this.states[4] ||
          this.currentState === this.states[5]
        ) {
          this.game.score++;
          // this.game.floatingMessages.push(
          //   new FloatingMessage("+1", enemy.x, enemy.y, 150, 50)
          // );
        } else {
          this.setState(6, 0);
          this.game.score -= 5;
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}
