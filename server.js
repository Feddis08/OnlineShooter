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

var message = {
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
    message.name = "Server";
    message.content = playerName + " joined the game";
    io.emit("Chat", message);
    message.id = socket.id;
    message.fromServer = true;
    //    console.log(GameServer.users);
    io.emit("response", GameServer.users);
  });
  socket.on("request", (action) => {
    //console.log("action", id, action);
    GameServer.users.forEach((user, index) => {
      if (user.id == socket.id) {
        user.action = action;
      }
    });
  });
  socket.on("chat", (pMessage) => {
    GameServer.users.forEach((user, index) => {
      if (socket.id == user.id) {
        console.log("[Chat]:", user.name, "says:", pMessage.content);
        message.content = pMessage.content;
        message.name = user.name;
        message.id = user.id;
        message.fromServer = false;
        io.emit("Chat", message);
        console.log(
          "[Chat]: send: ",
          message.content,
          "to",
          GameServer.users.lenght,
          "users"
        );
      }
    });
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
    GameServer.users.forEach((user, index) => {
      if (GameServer.users.lenght == 10) {
        GameServer.users = [];
        console.log("roboot");
      }
      if (user.action !== "idle") {
        //console.log("i have to do sg: ", user.id);
        var result = checkMove(user);
        if (result.collision === false) {
          GameServer.change = true;
          user.move(result.here.x1, result.here.y1);
        } else {
          user.collisionWith(result.collision);
          GameServer.change = true;
        }
      }
      //  const player = new Entity("asdfasdf", "wand", "entity", 350, 400);
      if (GameServer.change == true) {
        //user.action = "idle";
        io.emit("response", GameServer.users);
        GameServer.change = false;
        //console.log(GameServer.change);
      }
    });
  },
};

//wall (name, h, w, x, y)
const wall2 = new Wall("wall2", 600, 10, 0, 0);
const wall3 = new Wall("wall3", 10, 600, 0, 600);
const wall4 = new Wall("wall4", 610, 10, 600, 0);
const wall5 = new Wall("wall5", 10, 600, 0, 0);
const bullet = new Bullet();

GameServer.users.push(wall2, wall3, wall4, wall5, bullet);

GameServer.boot();
