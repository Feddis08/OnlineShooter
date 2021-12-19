const Entity = require("./Entity");
const Data = require("../modules/Data.js");

class Block extends Entity{
    constructor(blockOf, blockType){
        const type = "block";
        const name = "";
        const color = "black";
        const x = 0;
        const y = 0;
        super("none", name, type, x, y, 64, 64, color, "idle", false);
        this.blockOf = blockOf;
        this.blockType = blockType;
        this.blockX = 0;
        this.blockY = 0;
        this.constructBlock();
        Data.blocks.push(this); 
    }
    constructBlock(){
        this.blockChange = true;
        if (this.blockOf == "grass"){
            if (this.blockType == "normal"){
                this.color = "LightGreen";
                this.collisionTable.table = ["all"];
            }
            if(this.blockType == "wall"){
                this.color = "DarkGreen";
            }
        }
    }
    getBlockCoords(){
        this.blockX = this.x / 64;
        this.blockY = this.y / 64;
    }

}
module.exports = Block;