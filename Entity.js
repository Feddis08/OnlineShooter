var checkMove = require("./Collision.js");
class Entity {
  type = "";
  id = 0;
  name = "noName";
  action = "idle";
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
  toDelete = false;
  move(x, y) {
    this.x = x;
    this.y = y;
  }
  collisionWith(entity) {
    //this.action = "idle";
    console.log("collision: " + this.id + " with " + entity.id);
  }
  getId() {
    const rand = Math.random().toString();
    const id = "XX" + new Date().getTime() + rand.split(".")[1];
    console.log(id);
    this._id = id;
  }
  tick() {

  }
  deleteMe() {
    this.toDelete = true;
  }
  shoot() {
    console.log(this.name + " can not shoot");
  }
  actionHandling(action) {
    this.action = action;
    if (this.action == "Space") {
      console.log("shoooooot for paapa!!!");
      this.shoot();
    } else {
      var result = checkMove(this);
      if (result.collision === false) {
        this.move(result.here.x1, result.here.y1);
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
  constructor(id, name, type, x, y, w, h, color, action) {
    //console.log(type, x, y);
    this.id = id;
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.color = color;
    this.action = action;
    this.getId();
  }
}

module.exports = Entity;
