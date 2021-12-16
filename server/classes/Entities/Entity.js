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
    this.render = [];
    this.oldIDString = "";
    this.change = false;
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
    if (result.collistionsString == this.oldIDString){
      //console.log(222, result )
    }else{
      this.oldIDString = result.collistionsString;
      this.change = true;
    }
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
  this.lastAction = "idle";
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.color = color;
  this.move = move;
  this.lastMove = "idle";
  this.lastMoveDirection = "ArrowRight";
  this.step = 10;
  this.x2 = 0;
  this.y2 = 0;
  this.collisionTableString = "";
  this.getId();
  if (init) users.push(this);
  viewports.push(new Viewport(800, 800, this));
  }
  collisionTable =  {
    table: ["player"],
  }
  moveing(player) {
    if (player.move == "ArrowRight"){
      player.x = player.x + player.step; 
    }
    if (player.move == "ArrowLeft"){
      player.x = player.x - player.step;  
    }
    if (player.move == "ArrowUp"){
      player.y = player.y - player.step;  
    }
    if (player.move == "ArrowDown"){
      player.y = player.y + player.step;  
    }
  }
  collisionWith(entity) {
    //is in use! do not remove!
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
    //is in use! do not remove!
  }
  tick() {
    this.personalTick();
    this.online = data.onlinePlayers;
    this.upTime += 10;
    this.findViewport().checkViewport();
  }
  deleteMe() {
    this.toDelete = true;
  }
  shoot() {
    //is in use! do not remove!
  }
  actionHandling(action) {
    let stop = true;
    let otherStops = false;
    this.action = action;
    if (this.action == "Space") {
      this.shoot();
    }
    let result = checkMove(this);
    this.collisionWith(result.collision);
    if (result.collision == false){
      stop = false;
      otherStops = false;
    }
    if (this.move == "idle")return;
    this.collisionTable.table.forEach((objectType, index)=>{
      result.collisions.forEach((entity, index)=>{
        if (entity.type == objectType){
          stop = false;
        }else{
          stop = true;
          otherStops = true;
        }
      })
    })
    if (otherStops)stop = true;
    if(stop){
      this.move = "idle";
    }
    if (!(stop) || !(result.collision)){
      this.moveing(this);
    }
    return true;
  }
}

module.exports = Entity;
