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
      console.log("can't shoot!!!!!");
    } else {
      this.reloadTime = 1000;
      const xBullet = this.x + this.width + 40;
      const yBullet = this.y + this.height / 2;
      var bullet = new Bullet(xBullet, yBullet, "ArrowRight", this);
      GameServer.users.push(bullet);
    }
  }
  collisionWith(entity) {
    this.action = "idle";
    console.log("Upps", entity.id);
  }
}

module.exports = Player;
