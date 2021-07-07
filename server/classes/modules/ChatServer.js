
let users = require("./Data")
ChatServer = {
    check: false,
    pmessage: {
        name: "",
        id: "",
        content: "",
        fromServer: false,
    },
    log() {
        console.log(
            "[Chat]: send: ",
            ChatServer.pmessage.content,
            "to",
            users.length,
            "users"
        )
    },
    createChatMessage(message) {
        let result = null;
        users.forEach(user => {
            if (message.id == user.id) {
                console.log("[Chat]:", user.name, "says:", message.content);
                ChatServer.pmessage.content = message.content;
                ChatServer.pmessage.name = user.name;
                ChatServer.pmessage.id = user.id;
                ChatServer.pmessage.fromServer = false;
                ChatServer.log();
                result = ChatServer.pmessage;
            }
        });
        return result;
    }
}
module.exports = ChatServer.createChatMessage;