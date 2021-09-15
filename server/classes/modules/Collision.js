let data = require("./Data")
let users = data .users;
var checkMove = (entity) => {
  // clone player pos w/o changing object
  const direction = entity.move;
  let me = {
    id: entity.id,
    here: {
      x1: entity.x,
      y1: entity.y,
      x2: entity.x + entity.width,
      y2: entity.y + entity.height,
    },
  };
  const saveLastDirection = () => {
    entity.lastMoveDirection = direction;
  };
  if (direction == "ArrowUp") {
    me.here.y1 -= entity.step;
    me.here.y2 -= entity.step;
    saveLastDirection();
  }
  if (direction == "ArrowDown") {
    me.here.y1 += entity.step;
    me.here.y2 += entity.step;
    saveLastDirection();
  }
  if (direction == "ArrowRight") {
    me.here.x1 += entity.step;
    me.here.x2 += entity.step;
    saveLastDirection();
  }
  if (direction == "ArrowLeft") {
    me.here.x1 -= entity.step;
    me.here.x2 -= entity.step;
    saveLastDirection();
  }

  var result = collisionDetect(me);
  return {
    collision: result,
    here: me.here,
  };
};

var collisionDetect = (me) => {
  let collision = false;
  users.forEach((otherUser, index) => {
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
        }
      }
    }
  });
  return collision;
};
module.exports = checkMove;
