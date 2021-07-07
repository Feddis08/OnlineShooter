var Entity = require("./Entity.js");
var users = require("../modules/Data.js");
class Bullet extends Entity {
  constructor(x, y, shootDirection, player) {
    var h = 20;
    var w = 20;
    var x = x;
    var y = y;
    var type = "bullet";
    var color = "blue";
    var name = "";
    var id = "bullet";
    var move = shootDirection;
    super(id, name, type, x, y, w, h, color, move);
    var player = player;
    users.push(this);
  }
  tick2() {
    if (this.upTime == 5000) {
      this.deleteMe();
    }

  }
  collisionWith(entity) {
    if (this.from == entity) {
    }
    if (entity.type == "player") {
      entity.health -= 1;
      entity.hittedBy = this.player;
      this.deleteMe();
      //console.log("[Game]:", this.from.name, "hitted", entity.name, "(" + entity.health + ")");
    }
    if (entity.type == "wall") {
      this.deleteMe();
    }
    if (entity.type == "bullet") {
    } else {
      this.move = "idle";
      // "BOOOOOOM !!! hit with " + entity.id);
    }
  }
}

module.exports = Bullet;
