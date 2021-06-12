var checkMove = (entity) => {
  // clone player pos w/o changing object
  const direction = entity.action;
  let me = {
    id: entity.id,
    here: {
      x1: entity.x,
      y1: entity.y,
      x2: entity.x + entity.width,
      y2: entity.y + entity.height,
    },
  };
  if (direction == "ArrowUp") {
    me.here.y1 -= entity.step;
    me.here.y2 -= entity.step;
  }
  if (direction == "ArrowDown") {
    me.here.y1 += entity.step;
    me.here.y2 += entity.step;
  }
  if (direction == "ArrowRight") {
    me.here.x1 += entity.step;
    me.here.x2 += entity.step;
  }
  if (direction == "ArrowLeft") {
    me.here.x1 -= entity.step;
    me.here.x2 -= entity.step;
  }
  var result = collisionDetect(me);
  console.log(entity.id + " " + result);
  return {
    collision: result,
    here: me.here,
  };
  /*
  if (!entity.collision) {
    entity.x = me.here.x1;
    entity.y = me.here.y1;
  }
  if (entity.action !== "idle") GameServer.change = true;
  if (entity.type == "player") entity.action = "idle";
*/
};

var collisionDetect = (me) => {
  let collision = false;
  GameServer.users.forEach((user, index) => {
    if (!(user.id == me.id)) {
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

          collision = true;
          /*
          if (me.entity.type == "bullet") {
            me.entity.action = "idle";
            console.log("hit");
          }
        */
        }
      }
    }
  });
  return collision;
};
module.exports = checkMove;
