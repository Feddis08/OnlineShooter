document.addEventListener("keydown", (evt) => {
  if (evt.code == "Space") {
    var kugel = new Kugel(Player.xPos, Player.yPos);
    kugel.move = 3;
    Socket.pushData.push(kugel);
  }
  if (evt.code == "ArrowUp") {
    player.move = -10;
    Socket.update(player);
  } else if (evt.code == "ArrowDown") {
    player.move = 10;
    Socket.update(player);
  }
});
