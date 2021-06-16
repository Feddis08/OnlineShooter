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
  move(x, y) {
    this.x = x;
    this.y = y;
  }
  collisionWith(entity) {
    this.action = "idle";
    console.log("collision: " + this.id + " with " + entity.id);
  }
  getId() {
    const rand = Math.random().toString();
    const id = "XX" + new Date().getTime() + rand.split(".")[1];
    console.log(id);
    this._id = id;
  }
  constructor(id, name, type, x, y, w, h, color) {
    //console.log(type, x, y);
    this.id = id;
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.color = color;
    this.getId();
  }
}

module.exports = Entity;
