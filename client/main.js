var serverData;
var joined = false;
const gameBoard = document.querySelector("#gameBoard");
const status = document.querySelector("#status");
deleteObject = (object) => {
    const existingNode = gameBoard.querySelector("#" + object._id);
    if( existingNode ){
      gameBoard.removeChild(existingNode);
      if (object.name == "a bullet"){
      }
    }
    else {
      console.warn( 'object already removed!!!!')
    }

}
draw = (objects) => {
  objects.forEach((object) => {
    if (object.id == Server.socket.id) {
      status.innerHTML = "HP: " + object.health + " | Online: " + object.online;
      if (object.toDelete == true) {
        status.innerHTML = object.deleteInfo;
     //   deleteObject(object);
      }
    }
    //const existingNode = gameBoard.querySelector("#" + object._id);
    //if (existingNode) gameBoard.removeChild(existingNode);
    deleteObject(object);
    if( ! object.toDelete ) {
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
    }
  });
};
selfMoving=()=>{
  serverData.renderEntities.forEach((user, index)=>{
        if (user.move == "ArrowUp"){user.y += user.step}
        if (user.move == "ArrowDown"){user.y -= user.step}
        if (user.move == "ArrowRight"){user.x += user.step}
        if (user.move == "ArrowLeft"){user.x -= user.step}
        if (user.move == "idle"){}
        if (user.toDelete){
          serverData.renderEntities.splice(index, 1);
          deleteObject(user);
        }
        draw(serverData.renderEntities);
        return;
  })
}
//draw(objects);
let currentMove = "idle";
let currentAction = "idle";
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
            if (currentAction != evt.code){
              m = new Data({ action: "Space" })
              currentAction = evt.code;
            }
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
      currentAction = "";
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
    console.log("Sent:", this);
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
tick = () => {
  selfMoving();
}

const Server = {
//url: "http://10.0.0.118:25545",
  //url: "http://feddis08.ddns.net:80",
  url: "http://localhost:25545",
  //url: "http://10.0.0.165:25545",
  //url: "http://192.168.8.191:25545",
  //url: "http://192.168.10.252:25545",
  socket: null,
  chat(text) {
    const chat = document.querySelector("#chat");
    console.log(chat, text);
    chat.innerHTML = text + "<br>" + chat.innerHTML;
  },
  start(name) {
    this.socket = io.connect(this.url);
        setInterval(() => {
          tick();
        }, 10);
    this.socket.on("response", (data) => {
      //this.chat("updating spielfeld");
      serverData = data;
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

var join = function () {
  if (joined == false) {
    Server.start(name);
    //  var name = document.getElementById("playerName").value;
    var name = document.querySelector("#playerName").value;
    Server.socket.emit("join", name);
    joined = true;
  }
};
