var Entity = require("./Entity.js");
class Wall extends Entity {
  constructor(id, h, w, x, y, init) {
    var type = "wall";
    var color = "black";
    var name = "";
    super(id, name, type, x, y, w, h, color, "idle", init);
  }
}

module.exports = Wall;
