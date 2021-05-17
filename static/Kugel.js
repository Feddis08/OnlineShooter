class Kugel {
  xPos = 0;
  yPos = 0;
  kugel = 0;
  move = 0;
  name = "Kogel";
  isEntity = true;
  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.create();
  }
  create() {
    this.kugel = document.createElement("div");
    document.body.appendChild(this.kugel);
    this.kugel.classList.add("kugel");
    this.pos();
  }
  go(move) {
    this.xPos += 10;
    this.pos();
  }
  destroy() {
    document.body.removeChild(this.kugel);
  }

  pos() {
    this.kugel.style.left = this.xPos;
    this.kugel.style.top = this.yPos;
  }
}
