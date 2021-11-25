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
    findUser(name, isId){
        users.forEach((user, index)=>{
            if (isId == true){
                if (user.id == name){
                    return user;
                }
            } else if (user.name == name){
                return user;
            }
        });
    }
    findEntityById = ( id ) => users.find( user => user.theId() == id );
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
    send = (user, message) =>{
        if (user.isPlayer){
            this.io.to(user.id).emit("response", message);
        }
    }
    broadcast = (message) =>{
        this.io.emit("response", message);
    }
    server() {
        this.change = false;
        this.countOnlinePlayers();
        users.forEach((user, index) => {
            user.tick();
            if (user.move !== "idle" || user.action !== "idle") {
                if (user.action && user.actionHandling(user.action)){
                   let viewPort = user.findViewport();
                   this.send(user, viewPort.render);
                }
            }
            if (user.toDelete == true) {
                this.broadcast(users);
                if (user.type == "player") {
                    var killer = this.findEntityById(user.hittedBy);
                    pmessage.name = "Server";
                    if (user.died == true) {
                        pmessage.content = user.name + " was killed by " + killer.name;
                        this.io.emit("Chat", pmessage);
                        console.log("[Chat]: " + user.name + " was killed by " + killer.name);
                    } else {
                        pmessage.content = user.name + " disconnected from the game";
                        this.io.emit("Chat", pmessage);
                        console.log("[Chat]:", user.name, "disconnected from the game");
                    }
                }
                users.splice(index, 1);
            }
            //  const player = new Entity("asdfasdf", "wand", "entity", 350, 400);
        });
    };
};
module.exports = GameServer;
