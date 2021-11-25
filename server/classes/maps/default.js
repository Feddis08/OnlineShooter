var Wall = require("../Entities/Wall.js");
const Entity = require("../Entities/Entity");
const Player = require("../Entities/Player");
class DefaultMap {
    entities = [];
    constructor(init){
        if (init) this.create();
    }


    create(){
        let dummy1 = new Player("Dummy", "Dummy");
        const wall2 = new Wall("wall2", 1000, 10, 0, 0, true);
        const wall3 = new Wall("wall3", 10, 1000, 0, 1000, true);
        const wall4 = new Wall("wall4", 1010, 10, 1000, 0,true);
        const wall5 = new Wall("wall5", 10, 1000, 0, 0, true);
        this.entities.push(dummy1, wall2, wall3, wall4, wall5);
    }
    remove(){
        this.entities.forEach((entity, index) => {
            entity.deleteMe();
        });
    }
}

module.exports = DefaultMap;