var Wall = require("../Entities/Wall.js");
const Block = require("../Entities/Block.js");
const Data = require("../modules/Data.js");
const Player = require("../Entities/Player");
class DefaultMap {
    entities = [];
    mapX = 150;
    mapY = 150;
    currentX = 0; 
    currentY = 0;
    constructor(init){
        if (init) this.create();
    }


    create(){
        console.log("[Server]: creating map: ", this.mapX, this.mapY);
        let dummy1 = new Player("Dummy", "Dummy");
        for (let i = 0; i < this.mapY; i++) {
            for (let i = 0; i < this.mapX; i++) {
                let block = new Block("grass", "normal");
                block.x = this.currentX + 64;
                block.y = this.currentY;
                block.getBlockCoords();
                this.currentX = this.currentX + 64;
                this.entities.push(block);
            }
            this.currentY = this.currentY + 64;
            this.currentX = 0;
        }
        console.log("[Server]: done, map is finished!");
        /*
        const wall2 = new Wall("wall2", 1000, 10, 0, 0, true);
        const wall3 = new Wall("wall3", 10, 1000, 0, 1000, true);
        const wall4 = new Wall("wall4", 1010, 10, 1000, 0,true);
        const wall5 = new Wall("wall5", 10, 1000, 0, 0, true);
        */
    }
    remove(){
        this.entities.forEach((entity, index) => {
            entity.deleteMe();
        });
    }
}

module.exports = DefaultMap;