var Entity = require("./Entity.js");
class Wall extends Entity {
  constructor(id, h, w, x, y) {
    var type = "wall";
    var color = "black";
    var name = "wall";
    super(id, name, type, x, y, w, h, color);
  }
}

module.exports = Wall;
