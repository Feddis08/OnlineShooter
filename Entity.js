class Entity {
  type = "";
  id = 0;
  name = "noName";
  action = "idle";
  collision = false;
  x = 0;
  y = 0;
  width = 40;
  height = 100;
  x2 = 0;
  y2 = 0;
  step = 10;
  checkMove = (direction) => {
    let me = {
      entity: this,
      here: {
        x1: this.x,
        y1: this.y,
        x2: this.x + this.width,
        y2: this.y + this.height,
      },
    };
    if (direction == "ArrowUp") {
      me.here.y1 -= this.step;
      me.here.y2 -= this.step;
    }
    if (direction == "ArrowDown") {
      me.here.y1 += this.step;
      me.here.y2 += this.step;
    }
    if (direction == "ArrowRight") {
      me.here.x1 += this.step;
      me.here.x2 += this.step;
    }
    if (direction == "ArrowLeft") {
      me.here.x1 -= this.step;
      me.here.x2 -= this.step;
    }
    this.collisionDetect(me);
    if (!this.collision) {
      this.x = me.here.x1;
      this.y = me.here.y1;
    }
    if (this.action !== "idle") GameServer.change = true;
    this.action = "idle";
  };

  collisionDetect = (me) => {
    me.entity.collision = false;
    GameServer.users.forEach((user, index) => {
      if (!(user.id == me.entity.id)) {
        const other = {
          x1: user.x,
          y1: user.y,
          x2: user.x + user.width,
          y2: user.y + user.height,
        };
        if (me.here.x2 >= other.x1 && me.here.x1 <= other.x2) {
          //console.log("start3");
          if (me.here.y1 <= other.y2 && other.y1 <= me.here.y2) {
            //console.log(me.name, ":collision with:", user.name);
            me.entity.collision = true;
          }
        }
      }
    });
  };
  constructor(id, name, type, x, y) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

module.exports = Entity;
