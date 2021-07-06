var Bullet = require("./bullet.js");
var Entity = require("./Entity.js");
class Player extends Entity {
  reloadTime = 0;
  constructor(id, name) {
    var x = Math.random() * 400;
    var y = Math.random() * 400;
    var type = "player";
    var height = 100;
    var width = 50;
    var color = "red";
    super(id, name, type, x, y, width, height, color, "idle");
  }
  tick() {
    if (this.reloadTime != 0) {
      this.reloadTime -= 10;
    }

  }
  shoot() {
    if (this.reloadTime != 0) {
    } else {
      this.reloadTime = 100;
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
      GameServer.users.push(bullet);
    }
  }
  collisionWith(entity) {
    this.move = "idle";
  }
}

module.exports = Player;
