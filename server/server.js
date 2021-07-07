"use strict";
var express = require("express");
let users = require("./classes/modules/Data")
const GameServer = require("./classes/modules/GameServer");
var app = express();
var port = 25545;
var socket = require("socket.io");
var server = app.listen(port, function () {
  console.log("|WebServer: starting at port: " + port + " ...");
});
app.use(express.static("../client"));
var io = socket(server);
const gameServer = new GameServer(io);
var checkMove = require("./classes/modules/Collision.js");
var Entity = require("./classes/Entities/Entity.js");
var Player = require("./classes/Entities/Player.js");
var Wall = require("./classes/Entities/Wall.js");
var Bullet = require("./classes/Entities/Bullet.js");

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
    users.push(player); //, bullet);
    console.log("[Server]: user joined:", playerName);
    pmessage.name = "Server";
    pmessage.content = playerName + " joined the game";
    io.emit("Chat", pmessage);
    pmessage.id = socket.id;
    pmessage.fromServer = true;
    //    console.log(GameServer.users);
    io.emit("response", users);
  });
  socket.on("request", (message) => {
    users.forEach((user, index) => {
      if (user.id == socket.id) {
        user.move = message.move;
        user.action = message.action;
      }
    });
    if (message.content != null) {
      users.forEach((user, index) => {
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
            users.length,
            "users"
          );
        }
      });

    }
  });
  socket.on("disconnect", (socket, asdf) => {
    users.forEach((user, index) => {
      if (user.id == id) {
        user.toDelete = true;
      }
    });
    console.log(id);
  });
});


//wall (name, h, w, x, y)
const wall2 = new Wall("wall2", 600, 10, 0, 0);
const wall3 = new Wall("wall3", 10, 600, 0, 600);
const wall4 = new Wall("wall4", 610, 10, 600, 0);
const wall5 = new Wall("wall5", 10, 600, 0, 0);

users.push(wall2, wall3, wall4, wall5);

