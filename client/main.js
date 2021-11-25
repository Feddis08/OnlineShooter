var joined = false;
const gameBoard = document.querySelector("#gameBoard");
const status = document.querySelector("#status");
var oldUsers = [];
deleteObject = (object) => {
    const existingNode = gameBoard.querySelector("#" + object._id);
    if( existingNode ){
      gameBoard.removeChild(existingNode);
    }
    else {
      console.warn( 'object already removed!!!!')
    }

}

center = (object) =>{
  let x=object.x;
  let y=object.y;
  let height=object.height;
  let width=object.width;

  let centerX;
  let centerY;

  centerX = width / 2 + x;
  centerY = height /2 + y;
  return {centerY, centerX};
}

centerEntity = ({willCenter, tregetObject}) =>{
  const { centerX, centerY } = center(tregetObject);
  return {
    x: centerX - willCenter.width / 2,
    y: centerY - willCenter.height / 2
  }
}
var viewport = {
  width:500,
  height:500,
  x:0,
  y:0
};
preDraw = (objects) =>{
  let player2 = player;
  objects.forEach(( xplayer) => {
    if (xplayer.id == Server.socket.id) {
      let coords = centerEntity({willCenter:player, tregetObject:viewport});
      player2.x = coords.x;
      player2.y = coords.y;
    }
  } )
  return player2;
}
var camPlayer;
var player = "adad";
draw = (objects) => {
  camPlayer = preDraw(objects);
  objects.forEach((object) => {
    if (object.id == Server.socket.id) {
      player = object;
      string = 
      status.innerHTML = `HP: ${object.health} | Online: ${object.online}, "Coords: ", ${object.x}, ${object.y}`; 
      if (object.toDelete == true) {
        status.innerHTML = object.deleteInfo;
     //   deleteObject(object);
      }
    }
    //const existingNode = gameBoard.querySelector("#" + object._id);
    //if (existingNode) gameBoard.removeChild(existingNode);
  })
  culculatePossisions(objects);
}
culculatePossisions = (objects) =>{
    objects.forEach((object, index)=>{
      deleteObject(object);
      if( ! (object.toDelete)) {
        const domNode = document.createElement("div");
        gameBoard.appendChild(domNode);
        domNode.classList.add(object.type);
        domNode.textContent = object.name;
        domNode.id = object._id;
        domNode.style.background = object.color;
        domNode.style.height = object.height;
        domNode.style.width = object.width;
        domNode.style.top = (player.y + object.y) - camPlayer.y;
        domNode.style.left = (player.x + object.x) - camPlayer.x;
        if (object.id == Server.socket.id){
          console.log( 111 )
          domNode.style.top = camPlayer.y;
          domNode.style.left = camPlayer.x;
          domNode.style.background = object.color;
        }
      }
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
            currentMove = evt.code;
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
    this.socket.on("response", (objects) => {
      console.log( 213, objects );
      oldUsers.forEach((user, index)=>{
        deleteObject(user);
      })
      oldUsers = objects;
      draw(objects);
    });
    this.socket.on("Chat", (message) => {
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

document.addEventListener( 'DOMContentLoaded', () =>{
    document.querySelector("#playerName").value = "asdf";
    document.querySelector("#join").click();
})
