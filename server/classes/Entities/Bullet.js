var Entity = require("./Entity.js");
var data = require("../modules/Data.js");
let users = data.users;
class Bullet extends Entity {
  constructor(x, y, shootDirection, player) {
    const id = "id of a bullt";
    const name = "";
    const type = "bullet";
    super(id, name, type, x, y, 20, 20, "blue", shootDirection);
    this.player = player;
    this.collisionTable.table = ["all"];
    users.push(this);
  }
  personalTick() {
    if (this.upTime == 1500) {
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
    }
    if (entity.type == "wall") {
      this.deleteMe();
    }
    if (entity.type == "bullet") {
      this.deleteMe();
    } else {
      // "BOOOOOOM !!! hit with " + entity.id);
    }
  }
}

module.exports = Bullet;
