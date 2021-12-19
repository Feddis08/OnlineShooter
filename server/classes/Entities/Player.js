var Bullet = require("./Bullet.js");
var Entity = require("./Entity.js");
let data = require("../modules/Data")
var viewports = data.viewports;
class Player extends Entity {
  constructor(id, name) {
    let x = Math.random() * 400;
    let y = Math.random() * 400;
    const type = "player";
    const height = 60;
    const width = 60;
    let color = "red";
    super(id, name, type, x, y, width, height, color, "idle", true);
    this.reloadTime = 0;
    this.health = 10;
    this.hittedBy = "noName";
    this.died = false;
    this.collisionTable.table = ["all"];
    this.new = true;
  }
  personalTick() {
    let viewPort = this.findViewport();
    viewPort.checkViewport();
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
  }
}

module.exports = Player;
