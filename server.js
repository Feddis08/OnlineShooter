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
    const player = new Entity(id, playerName, "entity", x, y, 40, 100, "red");
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
  socket.on("chat", (pMessage) => {
    GameServer.users.forEach((user, index) => {
      if (socket.id == user.id) {
        console.log("[Chat]:", user.name, "says:", pMessage.content);
	message.content = pMessage.content;
        message.name = user.name;
        message.id = user.id;
        message.fromServer = false;
console.log(123123);
console.log( message, "---W", pMessage );
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
        console.log("roboot");
      }
      if (user.action !== "idle") {
        user.checkMove(user.action);
      }
        const player = new Entity("asdfasdf", "wand", "entity", 350, 400);
      if (GameServer.change == true) {
        user.action = "idle";
        io.emit("response", GameServer.users);
        GameServer.change = false;
        //console.log(GameServer.change);
      }
    });
  },
};

const wall1 = new Entity("wall1", "wand1", "entity", 350, 400, 40, 100, "green");
const wall2 = new Entity("wall2", "wand2", "entity", 0, 0, 20, 500, "black");
const wall3 = new Entity("wall3", "wand3", "entity", 0, 500, 500, 20, "black");
const wall4 = new Entity("wall2", "wand2", "entity", 0, 0, 20, 500, "black");
const wall5 = new Entity("wall2", "wand2", "entity", 0, 0, 20, 500, "black");
GameServer.users.push(wall1, wall2, wall3, wall4, wall5);

GameServer.boot();
