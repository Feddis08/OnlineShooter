var joined = false;
const shootIcon = document.querySelector("#shootIcon");
const arrowUp = document.querySelector("#ArrowUp");
const arrowDown = document.querySelector("#ArrowDown");
const arrowRight = document.querySelector("#ArrowRight");
const arrowLeft = document.querySelector("#ArrowLeft");
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
  width:800,
  height:600,
  x:0,
  y:0
};
checkMoveArrows = (player) => {
  arrowUp.style.color = "gray";
  arrowDown.style.color = "gray";
  arrowRight.style.color = "gray";
  arrowLeft.style.color = "gray";
  shootIcon.style.color = "gray";
  if (player.action == "Space"){
    shootIcon.style.color = "black";
  }
  if (player.move == "ArrowUp"){
    arrowUp.style.color = "black";
  }
  if (player.move == "ArrowDown"){
    arrowDown.style.color = "black";
  }
  if (player.move == "ArrowRight"){
    arrowRight.style.color = "black";
  }
  if (player.move == "ArrowLeft"){
    arrowLeft.style.color = "black";
  }
}
preDraw = (objects) =>{
  let player2 = {...player};
  objects.forEach(( xplayer) => {
    if (xplayer.id == Server.socket.id) {
      let coords = centerEntity({willCenter:xplayer, tregetObject:viewport});
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
      status.innerHTML = `HP: ${object.health} | Online: ${object.online} | Entities in view: ${objects.length} | Coords: ${object.x}, ${object.y}`; 
      if (object.toDelete == true) {
        status.innerHTML = object.deleteInfo;
     //   deleteObject(object);
      }
    }
    //const existingNode = gameBoard.querySelector("#" + object._id);
    //if (existingNode) gameBoard.removeChild(existingNode);
  })
 calculatePossisions(objects);
}
calculatePossisions = (objects) =>{
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
        domNode.style.top = (object.y - player.y) + camPlayer.y;
        domNode.style.left = (object.x - player.x) + camPlayer.x;
        domNode.style.border = "solid #ccc";
        if (object.id == Server.socket.id){
          domNode.style.border = "solid";
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
  document.addEventListener("keypress", (evnt)=>{
    checkMoveArrows(player);
  })
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
      checkMoveArrows(m);
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

selfMoving = () => {
  //Server.objects = Server.tempObjects;
  let someMove = false;
  Server.objects.forEach((player, index)=>{
    if (player.move !== "idle"){
      if (player.move == "ArrowRight"){
        player.x = player.x + player.step; 
        someMove = true;
      }
      if (player.move == "ArrowLeft"){
        player.x = player.x - player.step;  
        someMove = true;
      }
      if (player.move == "ArrowUp"){
        player.y = player.y - player.step;  
        someMove = true;
      }
      if (player.move == "ArrowDown"){
        player.y = player.y + player.step;  
        someMove = true;
      }
    }
  })
  if (someMove)draw(Server.objects);
}


update = () =>{
  selfMoving();
  checkMoveArrows(player);
}

const Server = {
  //url: "http://10.0.0.118:25545",
  //url: "http://feddis08.ddns.net:25545",
  url: "http://localhost:25545",
  //url: "http://10.0.0.165:25545",
  //url: "http://192.168.8.191:25545",
  //url: "http://192.168.10.252:25545",
  socket: null,
  objects: [],
  oldObjects: [],
  chat(text) {
    const chat = document.querySelector("#chat");
    console.log(chat, text);
    chat.innerHTML = text + "<br>" + chat.innerHTML;
  },
  start(name) {
    setInterval(() => {
        update();
    }, 10);
    this.socket = io.connect(this.url);
    this.socket.on("response", (objects) => {
    //draw(objects);
      Server.oldObjects.forEach((user, index)=>{
        deleteObject(user);
      })
      Server.oldObjects = objects;
      draw(objects);
      Server.objects = objects;

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
/*
document.addEventListener( 'DOMContentLoaded', () =>{
    document.querySelector("#playerName").value = "asdf";
    document.querySelector("#join").click();
})
*/
