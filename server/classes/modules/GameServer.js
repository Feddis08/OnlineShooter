let data = require("./Data")
let DefaultMap = require("../maps/default.js")
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
        const map = new DefaultMap(true);
        this.broadcast(users);
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
            //console.log(user.x)
        }
    }
    broadcast = (message) =>{
        this.io.emit("response", message);
    }
    clock = () =>{

        if (this.milli == 1000){
            this.sec + 1;
            this.milli = 0;
            return
        }
        if (this.sec == 1){
            this.milli = 0;
            this.sec = 0;
            return
        }else{
            this.milli = this.milli + 10;
            return
        }
    }
    milli = 0;
    sec = 0;
    update = (user) =>{
        if (this.sec == 1){
            let viewPort = user.findViewport();
            if (user.isPlayer) {
                this.send(viewPort.from, viewPort.render);
                console.log("made n update")
            }
        }
    }
    server() {
        this.change = false;
        this.countOnlinePlayers();
        this.clock();
        users.forEach((user, index) => {
            //this.update(user);
            if (user.new == true){
                this.send(user, Data.blocks);
                user.new = false;
            }
            user.tick();
            user.actionHandling(user.action);
            let viewPort = user.findViewport();
            if (viewPort.change){
                if (user.isPlayer) {
                    viewPort.change = false;
                    this.send(viewPort.from, viewPort.render);

                }
            }
            if (user.lastMove !== user.move || user.lastAction !== user.action){
                if (user.lastMove !== user.move){
                    user.lastMove = user.move;
                    viewPort.render.forEach((object, index)=>{
                        if (user.isPlayer) {
                            this.send(object, object.findViewport().render);
                        }
                    })
                }
                if (user.lastAction !== user.action){
                    user.lastAction = user.action;
                        if (user.isPlayer)this.send(user, viewPort.render);
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
