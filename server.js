var express = require("express");
var Entity = require("./Entity.js");
var app = express();
var port = 25545;
var socket = require("socket.io");
var server = app.listen(port, function () {
  console.log("|WebServer: starting at port: " + port + " ...");
});
app.use(express.static("static"));
var io = socket(server);

io.on("connection", (socket) => {
  let id = socket.id;
  socket.on("join", (playerName) => {
    var x = Math.random() * 400;
    var y = Math.random() * 400;
    x = 400;
    y = 400;
    const player = new Entity(id, playerName, "player", x, y);
    GameServer.users.push(player);
    //    console.log("join", player);
    //    console.log(GameServer.users);
    io.emit("response", GameServer.users);
  });
  socket.on("request", (action) => {
    console.log("action", id, action);
    GameServer.users.forEach((user, index) => {
      if (user.id == socket.id) {
        user.action = action;
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
    }, 1);
  },
  gameServer: () => {
    GameServer.users.forEach((user, index) => {
      if (user.action !== "idle") {
        user.checkMove(user.action);
      }
      if (GameServer.change == true) {
        user.action = false;
        io.emit("response", GameServer.users);
        GameServer.change = false;
      }
    });
  },
};

const player = new Entity("asdfasdf", "wand", "player", 350, 400);
GameServer.users.push(player);

GameServer.boot();
