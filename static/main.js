draw = (objects) => {
  objects.forEach((object) => {
    const existingNode = document.getElementById(object.id);
	if (existingNode ) document.body.removeChild( existingNode );
    const domNode = document.createElement("div");
    document.body.appendChild(domNode);
    domNode.classList.add(object.type);
    domNode.textContent = object.name;
    domNode.id = object.id;
    domNode.style.top = object.y;
    domNode.style.left = object.x;
    domNode.style.height = object.height;
    domNode.style.width = object.width;
    domNode.style.background = object.color; 
  });
};
//draw(objects);

keyHandles = () => {
  document.addEventListener("keydown", (evt) => {
    switch (evt.code) {
      case "Space":
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowRight":
      case "ArrowLeft":
        //Server.chat("next move: " + evt.code);
        Server.socket.emit("request", evt.code);
        break;
    }
  });
  document.addEventListener("keyup", (evt) => {
    Server.socket.emit("request", "idle");
  });
};
keyHandles();

class message {
  content = "";
  id = "";
  name = "";
  fromServer = false;
}

send = () => {
  message.content = document.querySelector("#chatInput").value;
  Server.socket.emit("chat", message);
};

const Server = {
  url: "http://10.0.0.118:25545",
  //url: "http://feddis08.ddns.net:80",
	url: "http://localhost:25545",
  socket: null,
  chat(text) {
    const chat = document.querySelector("#chat");
    chat.innerHTML = text + "<br>" + chat.innerHTML;
  },
  start(name) {
    this.socket = io.connect(this.url);
    this.socket.on("response", (objects) => {
      //this.chat("updating spielfeld");
      draw(objects);
    });
    this.socket.on("Chat", (message) => {
      this.chat("[" + message.name + "]:", message.content);
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
  //  var name = document.getElementById("playerName").value;
  var name = document.querySelector("#playerName").value;
  Server.socket.emit("join", name);
};
