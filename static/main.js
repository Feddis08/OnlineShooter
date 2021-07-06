var joined = false;
const gameBoard = document.querySelector("#gameBoard");
const hp = document.querySelector("#hp");
draw = (objects) => {
  objects.forEach((object) => {
    if (object.id == Server.socket.id) {
      hp.innerHTML = "HP: " + object.health;
      if (object.toDelete == true) {
        hp.innerHTML = object.deleteInfo;
      }
    }
    const existingNode = gameBoard.querySelector("#" + object._id);
    if (existingNode) gameBoard.removeChild(existingNode);

    if (object.toDelete) gameBoard.removeChild(existingNode);
    const domNode = document.createElement("div");
    gameBoard.appendChild(domNode);
    domNode.classList.add(object.type);
    domNode.textContent = object.name;
    domNode.id = object._id;
    domNode.style.top = object.y;
    domNode.style.left = object.x;
    domNode.style.height = object.height;
    domNode.style.width = object.width;
    domNode.style.background = object.color;
  });
};
//draw(objects);
let currentMove = "idle";
var changes = false;
keyHandles = () => {
  document.addEventListener("keydown", (evt) => {
    switch (evt.code) {
      case "Space":
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowRight":
      case "ArrowLeft":
        if (currentMove != evt.code) {
          if (evt.code == "Space") {
            m = new Data({ action: "Space" })
            //Server.socket.emit("request", evt.code);
          } else {
            console.log('xxx', evt)
            currentMove = evt.code;
            console.log(evt.code)
            m = new Data({ move: evt.code });
            //Server.socket.emit("request", evt.code);
          }
        }
        //Server.chat("next move: " + evt.code);
        break;
    }
  });
  document.addEventListener("keyup", (evt) => {
    if (evt.code == "Space") {
      m = new Data({
        move: currentMove
      });
      //m = new Data(currentMove, "idle", "idle", true);
      //Server.socket.emit("request", currentMove);
    } else {
      currentMove = "idle";
      m = new Data({
        move: "idle"
      });
      //Server.socket.emit("request", currentMove);
    }
  })
};
keyHandles();

var message = {
  content: "",
  id: "",
  name: "",
  fromServer: false,
};

class Data {
  id = "";
  name = "";
  content = "";
  isChatMessage = false;

  move = "";
  action = "";
  shootDirection = "";
  isMoveMessage = false;

  send = (m) => {
    Server.socket.emit("request", m);
    console.log("Sended:", this);
  }

  constructor(opts) {
    this.move = opts.move || null; //e.g Arrowup
    this.action = opts.action || "idle";//e.g shoot(space) do something
    this.isMoveMessage = (this.move) ? true : false;
    this.content = opts.content || null;
    this.send(this);
  }
}
createChatMessage = () => {
  const dnChatInput = document.querySelector("#chatInput");
  m = new Data({ content: dnChatInput.value });
}

const Server = {
  url: "http://10.0.0.118:25545",
  //url: "http://feddis08.ddns.net:80",
  url: "http://localhost:25545",
  url: "http://10.0.0.165:25545",
  socket: null,
  chat(text) {
    const chat = document.querySelector("#chat");
    console.log(chat, text);
    chat.innerHTML = text + "<br>" + chat.innerHTML;
  },
  start(name) {
    this.socket = io.connect(this.url);
    this.socket.on("response", (objects) => {
      //this.chat("updating spielfeld");
      draw(objects);
    });
    this.socket.on("Chat", (message) => {
      console.log(123, message);
      this.chat("[" + message.name + "]: " + message.content);
    });
    this.socket.on("accept", (data) => {
      this.chat("accepted");
    });
    this.socket.on("notAccept", (data) => {
      this.chat("not accepted");
    });
  },
};
Server.start(name);

var join = function () {
  if (joined == false) {
    //  var name = document.getElementById("playerName").value;
    var name = document.querySelector("#playerName").value;
    Server.socket.emit("join", name);
    joined = true;
  }
};
