class Player {
  xPos = 0;
  yPos = 0;
  domNode = 0;
  playerTyp = 0;
  move = 0;
  team = null;
  socketId = null;
  name = null;
  isEntity = true;
  willFire = false;
  constructor(xPos, yPos, name, team) {
    this.name = name;
    this.xPos = xPos;
    this.yPos = yPos;
    this.team = team;
    this.create();
  }
  create() {
    if (this.team == "red") {
      this.domNode = document.createElement("div");
      document.body.appendChild(this.domNode);
      this.domNode.classList.add("player");
      this.domNode.textContent = this.name;
      this.pos();
    }
    if (this.team == "blue") {
      this.domNode = document.createElement("div");
      document.body.appendChild(this.domNode);
      this.domNode.classList.add("player2");
      this.domNode.textContent = this.name;
      this.pos();
    }
  }
  go(motion) {
    if (motion == 1) {
      this.yPos += 10;
    }

    if (motion == 2) {
      this.yPos -= 10;
    }
    this.pos();
  }
  distroy() {}

  pos() {
    this.domNode.style.left = this.xPos;
    this.domNode.style.top = this.yPos;
  }
}
