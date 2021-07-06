var Entity = require("./Entity.js");
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
    var from = player;
    var move = shootDirection;
    super(id, name, type, x, y, w, h, color, move);
  }
  collisionWith(entity) {
    if (this.from == entity) {
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
