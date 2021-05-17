var player = null;
Socket = {
  pushData: [],
  entities: [],
  serverData: [],
  socket: null,
  join2: true,
  socketId: null,

  url: "http://10.0.0.118:25545",
  //url: "http://feddis08.ddns.net:25545",

  start: function (name) {
    this.socket = io.connect(this.url);
    this.socket.emit("join", name);
    this.socket.on("accept", (data) => {
      this.socketId = data.id;
      console.log(data);
      player = new Player(data.x, data.y, name, data.team);
      join2 = false;
      player.socketId = this.socketId;
      console.log(this.socketId);
    });
    this.socket.on("notAccept", (data) => {
      console.log(data);
      player.socketId = this.socketId;
      join2 = false;
      this.socketId = data.id;
    });
    this.socket.on("response", (data) => {
      player.yPos = data.yPos;
      player.pos();
    });
    this.socket.on("createP2", (player2Data) => {
      if (player2Data.waiting == true) {
        console.log("createP2");
        player2 = new Player(
          player2Data.xPos,
          player2Data.yPos,
          player2Data.name,
          player2Data.team
        );
      } else {
        player2 = new Player(
          player2Data.xPos,
          player2Data.yPos,
          player2Data.name,
          player2Data.team
        );
        console.log("createP2");
        player2.socketId = player2Data.socketId;
      }
    });
    this.socket.on("updateP2", (p2Data) => {
      console.log("change player2 pos");
      player2.xPos = p2Data.xPos;
      player2.yPos = p2Data.yPos;
    });
  },
  update(player) {
    console.log(player);
    this.socket.emit("request", player);
    console.log(player);
  },
  pushToServer: function (name) {
    console.log(
      "Socket: sending " + name + " " + this.pushData + " to Server..."
    );
    console.log("(" + this.url + ")");
    socket.emit(name, this.pushData);
  },
  listenServer: function (name) {
    io.on("connection", (socket) => {
      console.log("connection", socket);
      /*
      socket.on(name, function (data) {
        io.sockets.emit(name, Socket.serverData.push());
      });
    */
    });
  },
};
