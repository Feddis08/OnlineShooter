let data = require("./Data")
let sendingData = require("./SedingData")
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
        console.log(users)
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
    sendData = (user, comment) => {
        data = new sendingData();
        data.comment = comment;
        data.selfUser = user;
        data.renderEntities = users;
        this.io.to(user.id).emit("response", data);
    }
    sendBroadcast = (comment) => {
        data = new sendingData();
        data.comment = comment;
        data.renderEntities = users;
        this.io.emit("response", data);
    }
    count = 0;
    sec = 0;
    clock = () => {
        if (this.count == 1000) {content = 0; sec = 1;
        }else{this.sec = 0}
    }
    update = () =>{
        if (this.count == 1000) this.io.emit("response", (users));
    }
    server() {
        this.clock();
        this.update();
        this.change = false;
        this.countOnlinePlayers();
        users.forEach((user, index) => {
            user.tick();
            if (user.lastMove !== user.move || user.lastAction !== user.action){
                this.sendData(user);
                if (user.move !== "idle" || user.action !== "idle") {
                    if (user.action && user.actionHandling(user.action)) this.change = true;
                        this.sendData(user);
                }
            }
            if (user.toDelete == true) {
                this.sendBroadcast("delete");
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
            if (this.change == true) {
                //user.action = "idle";
                this.sendData(user);
                this.change = false;
                //console.log(GameServer.change);
            }
            //  const player = new Entity("asdfasdf", "wand", "entity", 350, 400);
        });
    };
};
module.exports = GameServer;
