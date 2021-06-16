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
  GameServer.users.forEach((otherUser, index) => {
    if (!(otherUser.id == me.id)) {
      const other = {
        x1: otherUser.x,
        y1: otherUser.y,
        x2: otherUser.x + otherUser.width,
        y2: otherUser.y + otherUser.height,
      };
      if (me.here.x2 >= other.x1 && me.here.x1 <= other.x2) {
        //.log("start3");
        if (me.here.y1 <= other.y2 && other.y1 <= me.here.y2) {
          //.log(me.name, ":collision with:", otherUser.name);

          collision = otherUser;
          /*
          if (me.entity.type == "bullet") {
            me.entity.action = "idle";
            .log("hit");
          }
        */
        }
      }
    }
  });
  return collision;
};
module.exports = checkMove;
