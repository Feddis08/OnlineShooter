center = (object) =>{
    let x=object.x;
    let y=object.y;
    let height=object.height;
    let width=object.width;

    let centerX;
    let centerY;

    centerX = width / 2 + x;
    centerY = height /2 + y;
    return {centerY, centerX};
}
module.exports = center;