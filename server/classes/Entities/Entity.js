var checkMove = require("../modules/Collision.js");
class Entity {
  constructor(id, name, type, x, y, w, h, color, move) {
  this.toDelete = false;
  this.upTime = 0;
  this.deleteInfo = "nothing";
  this.collision = false;
    this.id = id;
    this.name = name;
    this.type = type;
  this.action = "idle";
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.color = color;
    this.move = move;
    this.lastMoveDirection = "ArrowRight";
  this.step = 10;
  this.x2 = 0;
  this.y2 = 0;
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
