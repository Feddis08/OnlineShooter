var Entity = require("./Entity.js");
class Player extends Entity {
  constructor(id, name) {
    var x = Math.random() * 400;
    var y = Math.random() * 400;
    var type = "player";
    var height = 100;
    var width = 50;
    var color = "red";
    super(id, name, type, x, y, width, height, color);
  }
}

module.exports = Player;
