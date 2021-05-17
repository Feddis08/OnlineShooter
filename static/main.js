draw = (objects) => {
  objects.forEach((object) => {
    //console.log(object);
    const existingNode = document.getElementById(object.id);
    //const existingNode = document.querySelector( "#" + object.id);
    console.log(existingNode);
    if (existingNode) document.body.removeChild(existingNode);
    const domNode = document.createElement("div");
    document.body.appendChild(domNode);
    domNode.classList.add(object.type);
    domNode.textContent = object.name;
    domNode.id = object.id;
    domNode.style.top = object.y;
    domNode.style.left = object.x;
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
        Server.socket.emit("request", evt.code);
        break;
    }
  });
  document.addEventListener("keyup", (evt) => {
    Server.socket.emit("request", "idle");
  });
};
keyHandles();

const Server = {
  url: "http://10.0.0.118:25545",
  //url: "http://feddis08.ddns.net:80",
  socket: null,
  start(name) {
    this.socket = io.connect(this.url);
    this.socket.on("response", (objects) => {
      draw(objects);
    });
    this.socket.on("accept", (data) => {
      console.log("accepted");
    });
    this.socket.on("notAccept", (data) => {
      console.log("not accepted");
    });
  },
};
Server.start(name);

var join = function () {
  //  var name = document.getElementById("playerName").value;
  var name = document.querySelector("#playerName").value;
  Server.socket.emit("join", name);
};
