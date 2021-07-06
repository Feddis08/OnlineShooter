var express = require("express");
var checkMove = require("./Collision.js");
var Entity = require("./Entity.js");
var Player = require("./Player.js");
var Wall = require("./Wall.js");
var Bullet = require("./bullet.js");
var app = express();
var port = 25545;
var socket = require("socket.io");
var server = app.listen(port, function () {
  console.log("|WebServer: starting at port: " + port + " ...");
});
app.use(express.static("static"));
var io = socket(server);

var pmessage = {
  name: "",
  id: "",
  content: "",
  fromServer: false,
};

io.on("connection", (socket) => {
  let id = socket.id;
  socket.on("join", (playerName) => {
    const player = new Player(id, playerName);
    GameServer.users.push(player); //, bullet);
    console.log("[Server]: user joined:", playerName);
    pmessage.name = "Server";
    pmessage.content = playerName + " joined the game";
    io.emit("Chat", pmessage);
    pmessage.id = socket.id;
    pmessage.fromServer = true;
    //    console.log(GameServer.users);
    io.emit("response", GameServer.users);
  });
  socket.on("request", (message) => {
    GameServer.users.forEach((user, index) => {
      if (user.id == socket.id) {
        user.move = message.move;
        user.action = message.action;
      }
    });
    if (message.content != null) {
      GameServer.users.forEach((user, index) => {
        if (socket.id == user.id) {
          console.log("[Chat]:", user.name, "says:", message.content);
          pmessage.content = message.content;
          pmessage.name = user.name;
          pmessage.id = user.id;
          pmessage.fromServer = false;
          io.emit("Chat", pmessage);
          console.log(
            "[Chat]: send: ",
            pmessage.content,
            "to",
            GameServer.users.lenght,
            "users"
          );
        }
      });

    }
  });
  socket.on("disconnect", (socket, asdf) => {
    GameServer.users.forEach((user, index) => {
      if (user.id == id) {
        user.toDelete = true;
      }
    });
    console.log(id);
  });
});

GameServer = {
  users: [],
  change: false,
  boot: () => {
    //   console.log("|GameServer: starting with 100 ...");
    setInterval(() => {
      GameServer.gameServer();
    }, 10);
  },
  gameServer: () => {
    GameServer.change = false;
    GameServer.users.forEach((user, index) => {
      user.tick();
      if (user.move !== "idle" || user.action !== "idle") {
        if (user.actionHandling(user.action)) GameServer.change = true;
      }

      if (user.toDelete == true) {
        io.emit("response", GameServer.users);
        GameServer.users.splice(index, 1);
        if (user.type == "player") {
          pmessage.name = "Server";
          if (user.died == true) {
            pmessage.content = user.name + " was killed by " + user.hittedBy;
            io.emit("Chat", pmessage);
            console.log(user.name + " was killed by " + user.hittedBy);
          } else {
            pmessage.content = user.name + " disconnected from the game";
            io.emit("Chat", pmessage);
            console.log("[Chat]:", user.name, "disconnected from the game");
          }
        }
      }
      //  const player = new Entity("asdfasdf", "wand", "entity", 350, 400);
    });
    if (GameServer.change == true) {
      //user.action = "idle";
      io.emit("response", GameServer.users);
      GameServer.change = false;
      //console.log(GameServer.change);
    }
  },
};

//wall (name, h, w, x, y)
const wall2 = new Wall("wall2", 600, 10, 0, 0);
const wall3 = new Wall("wall3", 10, 600, 0, 600);
const wall4 = new Wall("wall4", 610, 10, 600, 0);
const wall5 = new Wall("wall5", 10, 600, 0, 0);

GameServer.users.push(wall2, wall3, wall4, wall5);

GameServer.boot();
