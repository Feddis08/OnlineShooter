var Entity = require("./Entity.js");
class Bullet extends Entity {
  constructor(x, y, action, player) {
    var h = 20;
    var w = 20;
    var x = x;
    var y = y;
    var type = "bullet";
    var color = "blue";
    var name = "";
    var id = "bullet";
    var from = player;
    super(id, name, type, x, y, w, h, color, action);
  }
  collisionWith(entity) {
    console.log("!!!!!!!!!!");
    if (this.from == entity) {
      console.log("I don't hit my master");
    }
    if (entity.type == "wall") {
      this.deleteMe();
    }
    if (entity.type == "bullet") {
      console.log("I don't hit my brothers");
    } else {
      this.action = "idle";
      console.log("BOOOOOOM !!! hit with " + entity.id);
    }
  }
}

module.exports = Bullet;
