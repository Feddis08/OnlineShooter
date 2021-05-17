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

var entities = [];

io.on("connection", (socket) => {
  let id = socket.id;
  socket.on("join", (playerName) => {
    var x = Math.random() * 400;
    var y = Math.random() * 400;
    const player = new Entity(id, playerName, "player", x, y);
    entities.push(player);
    console.log("join", player);
    console.log("all players: ", entities);
  });
  socket.on("request", (action) => {
    console.log("action", id, action);
    entities.forEach((entity) => {
      if (entity.id == socket.id) {
        entity.wantsToGo = action;
        if (action == "ArrowUp") {
          entity.y += -10;
        }
        if (action == "ArrowDown") {
          entity.y += 10;
        }
        if (action == "ArrowRight") {
          entity.x += -10;
        }
        if (action == "ArrowLeft") {
          entity.x += 10;
        }
      }
    });
    io.emit("response", entities);
  });
});

GameServer = {
  playerCount: 0,
  serverStatus: "off",
  entities: [],
  serverData: [],
  socketIDs: [],
  socketConnection() {
    try {
      if (this.serverStatus == "off") {
        console.log("!System: GameServer is", this.serverStatus + "line ...");
      }
      if (this.serverStatus == "on") {
        console.log("|System: GameServer is", this.serverStatus + "line ...");
      }
      io.on("connection", (socket) => {
        socket.on("join", (playerName) => {
          // logik um zu checken ob spierl spielen darf (zb vorraum)
          if (this.playerCount >= 2) {
            socket.emit("notAccept", {
              id: socket.id,
              answer: "to many players",
            });
            player = new Entity(socket.id, playerName, true, true);
            player.socketId = socket.id;
            player.name = playerName;
            player.waiting = true;
            this.serverData.push(player);
          } else {
            player = new Entity(socket.id, playerName, true, true);
            if (this.playerCount == 0) {
              socket.emit("accept", {
                id: socket.id,
                team: "red",
                x: 200,
                y: 200,
              });
              player.team = "red";
              player.isCreated = true;
              this.serverData.push(player);

              io.to(socket.id).emit("createP2", {
                name: "waiting",
                team: "blue",
                x: 400,
                y: 200,
                id: null,
                waiting: true,
              });
            }
            if (this.playerCount == 1) {
              socket.emit("accept", {
                id: socket.id,
                team: "blue",
                x: 400,
                y: 200,
              });
              player.team = "blue";
              this.serverData.push(player);
              this.serverData.forEach((data, index) => {
                if (data.team == "red") {
                  io.to(data.socketId).emit("createP2", data);
                  console.log("createP2", data);
                }
              });
            }
            player.name = playerName;
            player.socketId = socket.id;
            player.registert = true;
            console.log("|Socket: connection accepted with:", player);
            //console.log(this.serverData);
          }
        });
        socket.on("request", (clientPlayer) => {
          //console.log(">>>");
          //console.log(this.serverData);
          this.serverData.forEach((data, index) => {
            if (data.registert == true) {
              if (clientPlayer.socketId == data.socketId) {
                data.move = clientPlayer.move;
                data.action = true;
                //           console.log("|GameServer: action accepted for:", data.name);
              }
            }
          });
        });
        socket.on("disconnected", () => {
          this.serverData.splice(player, 1);
          console.log(serverData);
        });
      });
    } catch {
      console.log("!Socket: error at socketConnection ...");
      GameServer.reboot(1);
    }
  },
  boot: function () {
    console.log("|GameServer: starting with 100 ...");
    //this.installer();
    //this.getData();
    setInterval(() => {
      this.gameServer();
    }, 100);
    this.socketConnection();
  },
  gameServer: function () {
    this.serverData.forEach((data, index) => {
      if (data.isEntity == true) {
        if (data.isPlayer == false) {
          if (data.name == "Kogel") {
            if (data.xPos == 1000) {
              data.destroy();
            }
          }
        }
        if (data.move == 0) {
          // nix
        } else {
          //    console.log(data.name + " moved...");
        }
      }

      if (data.isPlayer == true) {
        if (data.action == true) {
          //if (!(data.yPos >= 800 || data.move == 10)) {
          data.yPos += data.move;
          io.to(data.socketId).emit("response", data);
          this.serverData.forEach((player2, index) => {
            if (player2.isPlayer == true) {
              io.to(player2.socketId).emit("updateP2", player2);
            }
          });
          data.action = false;
          //console.log("|GameServer:", data.name, "moved ...");
          //}
        }
        if (data.counted == false) {
          if (data.waiting == false) {
            if (data.registert == true) {
              this.playerCount += 1;
              data.counted = true;
            } else {
              //data.registert = true;
              //console.log("|GameServer: ", data.name, " is now in the system ...");
              console.log(
                "|GameServer: ",
                this.playerCount,
                " are in the system ..."
              );
            }
          } else {
            //nothing
          }
        }
      }
      //console.log(">>>", data);
    });
    this.serverStatus = "on";
  },
  installer: function () {
    console.log("|Installer: looking for installations ...");
  },
};
GameServer.boot();
