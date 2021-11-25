var checkMove = require("../modules/Collision.js");
var center = require("../modules/center.js");
let data = require("../modules/Data")
var users = data.users;
var viewports = data.viewports;
class Viewport {
  constructor(height, width, from){
    this.height = height;
    this.width = width;
    this.x = 0;
    this.y = 0;
    this.from = from;
    this.render;
    //viewports.push(this);
  }
  checkViewport = () =>{
    const coords = this.from.centerEntity({willCenter:this, tregetObject: this.from});
    let viewPortMe = {
      id: "Viewport",
      here: coords
    };
    this.x = coords.x;
    this.y = coords.y;
    let result = checkMove(this)
    this.render = result.collisions;

  }
}
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
  if (init) users.push(this);
  viewports.push(new Viewport(500, 500, this));
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
  centerEntity({willCenter, tregetObject}) {
    const { centerX, centerY } = center(tregetObject);
    return {
      x: centerX - willCenter.width / 2,
      y: centerY - willCenter.height / 2
    }
  }
  findViewport(){
    let result;
    viewports.forEach((element, index)=>{
      if (element.from.id == this.id){
        result = element;
      }
    })
    return result;
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
