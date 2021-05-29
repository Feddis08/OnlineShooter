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

var message = {
  name: "",
  id: "",
  content: "",
  fromServer: false,
};

io.on("connection", (socket) => {
  let id = socket.id;
  socket.on("join", (playerName) => {
    var x = Math.random() * 400;
    var y = Math.random() * 400;
    x = 400;
    y = 400;
    const player = new Entity(id, playerName, "player", x, y);
    GameServer.users.push(player);
    console.log("[Server]: user joined:", playerName);
    message.name = playerName;
    message.content = "joined the game";
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
  socket.on("chat", (message) => {
    GameServer.users.forEach((user, index) => {
      if (socket.id == user.id) {
        console.log("[Chat]:", user.name, "says:", message.content);
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
    }, 1);
  },
  gameServer: () => {
    GameServer.users.forEach((user, index) => {
      if (GameServer.users.lenght == 10) {
        GameServer.users = [];
        const player = new Entity("asdfasdf", "wand", "player", 350, 400);
        console.log("roboot");
      }
      if (user.action !== "idle") {
        user.checkMove(user.action);
      }
      if (GameServer.change == true) {
        user.action = "idle";
        io.emit("response", GameServer.users);
        GameServer.change = false;
        //console.log(GameServer.change);
      }
    });
  },
};

const player = new Entity("asdfasdf", "wand", "player", 350, 400);
GameServer.users.push(player);

GameServer.boot();
