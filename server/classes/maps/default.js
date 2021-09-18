var Wall = require("../Entities/Wall.js");
const Entity = require("../Entities/Entity");
class DefaultMap {
    entities = [];
    constructor(init){
        if (init) this.create();
    }


    create(){

        const wall2 = new Wall("wall2", 600, 10, 0, 0, true);
        const wall3 = new Wall("wall3", 10, 600, 0, 600, true);
        const wall4 = new Wall("wall4", 610, 10, 600, 0,true);
        const wall5 = new Wall("wall5", 10, 600, 0, 0, true);
        this.entities.push(wall2, wall3, wall4, wall5);
    }
    remove(){
        this.entities.forEach((entity, index) => {
            entity.deleteMe();
        });
    }
}

module.exports = DefaultMap;