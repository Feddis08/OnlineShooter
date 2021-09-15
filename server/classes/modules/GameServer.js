let data = require("./Data")
let users = data.users;
let onlinePlayers = data.onlinePlayers;
var pmessage = {
    name: "",
    id: "",
    content: "",
    fromServer: false,
};
class GameServer {
    players = 0;
    constructor(io) {
        this.change = false;
        this.io = io;
        this.boot();
    }
    boot() {
        setInterval(() => {
            this.server();
        }, 10);
    };
    countOnlinePlayers(){
        this.players=0;
        onlinePlayers=0;
        users.forEach((user, index) => {
            if (user.isPlayer){
                this.players += 1;
                onlinePlayers = this.players;
                data.onlinePlayers = onlinePlayers;
            }
        })
    }
    server() {
        this.change = false;
        this.countOnlinePlayers();
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
                        pmessage.content = user.name + " was killed by " + user.hittedBy.name;
                        this.io.emit("Chat", pmessage);
                        console.log("[Chat]: " + user.name + " was killed by " + user.hittedBy.name);
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
