var Entity = require("./Entity.js");
class Bullet extends Entity {
  constructor() {
    var h = 20;
    var w = 20;
    var x = 40;
    var y = 40;
    var type = "bullet";
    var color = "blue";
    var name = "bullet";
    var id = "bullet";
    super(id, name, type, x, y, w, h, color);
    this.action = "ArrowRight";
  }
}

module.exports = Bullet;
