var checkMove = require("../modules/Collision.js");
let data = require("../modules/Data")
let users = data.users;
class Entity {
  constructor(id, name, type, x, y, w, h, color, move, init) {
  
  this.init = init;
  this.toDelete = false;
  this.isPlayer = false;
  this.upTime = 0;
  this.online = 0;
  this.deleteInfo = "nothing";
  this.collision = false;
  this.id = id;
  this.name = name;
  this.type = type;
  this.action = "idle";
  this.lastAction;
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.color = color;
  this.move = move;
  this.lastMove;
  this.lastMoveDirection = "ArrowRight";
  this.step = 10;
  this.x2 = 0;
  this.y2 = 0;
  this.getId();
  if (init) users.push(this);
  }
  saveLastActions(move, action){
    this.lastMove = this.move;
    this.lastAction = this.lastAction;

    this.move = move;
    this.action = action;
  }
  moveInitial(move, action){
    this.saveLastActions(move, action);
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
  theId() {
    return this.id;
  }
  personalTick() {
  }
  tick() {
    this.personalTick();
    this.online = data.onlinePlayers;
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
