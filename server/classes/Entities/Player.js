var Bullet = require("./Bullet.js");
var Entity = require("./Entity.js");
class Player extends Entity {
  constructor(id, name) {
    let x = Math.random() * 400;
    let y = Math.random() * 400;
    const type = "player";
    const height = 100;
    const width = 50;
    let color = "red";
    super(id, name, type, x, y, width, height, color, "idle");
    this.reloadTime = 0;
    this.health = 10;
    this.hittedBy = "noName";
    this.died = false;
  }
  personalTick() {
    if (this.reloadTime != 0) {
      this.reloadTime -= 10;
    }
    if (this.health == 0) {
      this.deleteInfo = "GameOver";
      this.died = true;
      this.deleteMe();
    }

  }
  shoot() {
    if (this.reloadTime != 0) {
    } else {
      this.reloadTime = 1000;
      if (this.lastMoveDirection == "ArrowRight") {
        var xBullet = this.x + this.width + 40;
        var yBullet = this.y + this.height / 2;
        var bullet = new Bullet(xBullet, yBullet, this.lastMoveDirection, this);
      }
      if (this.lastMoveDirection == "ArrowLeft") {
        var xBullet = this.x + this.width + -90;
        var yBullet = this.y + this.height / 2;
        var bullet = new Bullet(xBullet, yBullet, this.lastMoveDirection, this);
      }
      if (this.lastMoveDirection == "ArrowDown") {
        var yBullet = this.y + this.height + 40;
        var xBullet = this.x + this.width / 2;
        var bullet = new Bullet(xBullet, yBullet, this.lastMoveDirection, this);
      }
      if (this.lastMoveDirection == "ArrowUp") {
        var yBullet = this.y + this.height - 140;
        var xBullet = this.x + this.width / 2;
        var bullet = new Bullet(xBullet, yBullet, this.lastMoveDirection, this);
      }
      //var bullet = new Bullet(xBullet, yBullet, this.shootDirection, this);
    }
  }
  collisionWith(entity) {
    this.move = "idle";
  }
}

module.exports = Player;
