var checkMove = require("./Collision.js");
class Entity {
  type = "";
  deleteInfo = "nothing";
  id = 0;
  changes = false;
  name = "noName";
  action = "idle";
  move = "idle";
  collision = false;
  health = 3;
  x = 0;
  y = 0;
  width = 40;
  height = 100;
  color = "";
  x2 = 0;
  y2 = 0;
  step = 10;
  upTime = 0;
  toDelete = false;
  constructor(id, name, type, x, y, w, h, color, move) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.color = color;
    this.move = move;
    this.lastMoveDirection = "ArrowRight";
    this.getId();
  }
  moveing(x, y) {
    this.x = x;
    this.y = y;
  }
  collisionWith(entity) {
    //this.action = "idle";
    // "collision: " + this.id + " with " + entity.id);
  }
  getId() {
    const rand = Math.random().toString();
    const id = "XX" + new Date().getTime() + rand.split(".")[1];
    this._id = id;
  }
  tick2() {

  }
  tick() {
    this.tick2();
    this.upTime += 10;
  }
  deleteMe() {
    this.toDelete = true;
  }
  shoot() {
  }
  actionHandling(action) {
    this.action = action;
    if (this.action == "Space") {
      this.shoot();
    } else {
      var result = checkMove(this);
      if (result.collision === false) {
        this.moveing(result.here.x1, result.here.y1);
        return true;
      } else {
        this.collisionWith(result.collision);
        // REF: wir bruachen bei collision nur updates hochschicken
        // wenn die kollision einen effekt hat.. zb NICHT wenn ich
        // gegen die wand laufe
        return true;
      }
    }
  }
}

module.exports = Entity;
