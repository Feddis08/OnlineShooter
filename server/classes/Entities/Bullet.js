var Entity = require("./Entity.js");
var data = require("../modules/Data.js");
let users = data.users;
class Bullet extends Entity {
  constructor(x, y, shootDirection, player) {
    const id = "id of a bullt";
    const name = "a bullet";
    const type = "bullet";
    super(id, name, type, x, y, 20, 20, "blue", shootDirection);
    this.player = player;
    users.push(this);
  }
  personalTick() {
    if (this.upTime == 5000) {
      this.deleteMe();
    }

  }
  collisionWith(entity) {
    if (this.from == entity) {
    }
    if (entity.type == "player") {
      entity.health -= 1;
      entity.hittedBy = this.player.id;
      this.deleteMe();
      //console.log("[Game]:", this.from.name, "hitted", entity.name, "(" + entity.health + ")");
    }
    if (entity.type == "wall") {
      this.deleteMe();
    }
    if (entity.type == "bullet") {
      this.deleteMe();
    } else {
      this.move = "idle";
      // "BOOOOOOM !!! hit with " + entity.id);
    }
  }
}

module.exports = Bullet;
