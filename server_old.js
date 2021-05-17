var express = require("express");
var Entity = require("./Entity.js");

var app = express();
var port = 25545;
var socket = require("socket.io");
var server = app.listen(port, function(){
	
	console.log("|WebServer: starting at port: " + port + " ..."); 
});
app.use(express.static("static"));
var io = socket(server);
GameServer = {
        entities : [],
	socketIDs : [],
	SocketIoServer : {
		socketConnection : function(storage, name, name2, player){
			try{
				io.on("connection", function(socket){
					console.log("|Socket: connecting with client ...");
					name2 = new storage(socket.id, name, player); 
					console.log("|Socket: connection with " + name2 + " ...");
					GameServer.socketIDs.push(socket.id);
				});
			
			}catch{
				console.log("!Socket: error at socketConnection ...");
				GameServer.restart(1);
			}
		},
		socketListen : function(name, storage){
			
			try{
				//io.on("connection", function(socket){
				console.log("|Socket: listen for " + name + " and storaged in " + storage + " ...");
				socket.on(name, function(name){
					io.sockets.emit(name, storage);
					console.log("|System: entities: " + GameServer.entities);
				});
				//});
			}catch{
				console.log("!Socket: error at socketListen ...");
				GameServer.restart(2);
			}	
		},
		socketIo : function(){
			try{
				console.log("|Socket: starting...");
				io.on("connection", function(socket){
				
					console.log("|Socket: connection with " + socket.id + " ...");
				});
			
			}catch{
				console.log("!Socket: error at socketIo ...");
				GameServer.restart(1);
			}
		},
	},
	restart : function(arg0){
		i = 1;
		console.log("!GameServer: restarting with error: " + arg0 + " ...");
		while (i == 2){
			this.start
		}
		this.check();
	},
        start : function(){
		console.log("|GameServer: starting with 100 ...");
		this.SocketIoServer.socketConnection("Entity"," player", "1" );
                setInterval(
                        () => { this.check() },
			100
                );
        },
        check : function(){
                this.entities.forEach((entity, index) => {
                        if (entity.name == "Kogel"){
                                if (entity.xPos == 1000){
                                        entity.destroy();
                                        this.entities.splice(index, 1);
                                }
                        }
                        entity.go(entity.move);
                        if (entity.move == 0){
                        }else{
                        console.log(entity.name + " moved...");
                        }
                        entity.move = 0;
                })
        }
}
GameServer.start();
