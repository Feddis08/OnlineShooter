let users = require("./Data")
var pmessage = {
    name: "",
    id: "",
    content: "",
    fromServer: false,
};
class GameServer {
    change = false;
    io = null;
    constructor(io) {
        this.io = io;
        this.boot();
    }
    boot = () => {
        setInterval(() => {
            this.server();
        }, 10);
    };
    server = () => {
        this.change = false;
        users.forEach((user, index) => {
            user.tick();
            if (user.move !== "idle" || user.action !== "idle") {
                if (user.actionHandling(user.action)) this.change = true;
            }

            if (user.toDelete == true) {
                this.io.emit("response", users);
                users.splice(index, 1);
                if (user.type == "player") {
                    pmessage.name = "Server";
                    if (user.died == true) {
                        pmessage.content = user.name + " was killed by " + user.hittedBy;
                        this.io.emit("Chat", pmessage);
                        console.log(user.name + " was killed by " + user.hittedBy);
                    } else {
                        pmessage.content = user.name + " disconnected from the game";
                        this.io.emit("Chat", pmessage);
                        console.log("[Chat]:", user.name, "disconnected from the game");
                    }
                }
            }
            //  const player = new Entity("asdfasdf", "wand", "entity", 350, 400);
        });
        if (this.change == true) {
            //user.action = "idle";
            this.io.emit("response", users);
            this.change = false;
            //console.log(GameServer.change);
        }
    };
};
module.exports = GameServer;