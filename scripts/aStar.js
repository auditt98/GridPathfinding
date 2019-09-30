let boxes = document.getElementsByClassName("box")
let wall = [14, 21, 22, 25, 37, 45, 51, 52, 53, 57, 62, 65, 66, 67, 74, 75, 77]
let rowCount = 10;
let colCount = 10;
let start = 0
let end = 0
let startX = 0
let endX = 0
let startY = 0
let endY = 0
let startCor = 0
let endCor = 0


let openList = []
let closedList = []

class Cordinate{
    constructor(x, y, g, h){
        this.x = x
        this.y = y
        this.g = g //movement cost from starting points to here
        this.h = h //estimated movement cost from here to end points
        this.f = g + h
        this.children = []
    }
    isSame(cordinateObj){
        if(this.x === cordinateObj.x && this.y === cordinateObj.y){
            return true
        } else{
            return false
        }
    }
    genChildren(){
        let adjCor = [{x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: -1}]
        for(let i = 0; i < adjCor.length; i++){
            let childX = adjCor[i].x + this.x
            let childY = adjCor[i].y + this.y
            let child = new Cordinate(childX, childY)
            if(typeOf(child) !== "wall"){
                this.children.push(child)
            }
        }
    }
}



function buildWalls(){
        for(let i = 0; i < rowCount; i++){
            for(let j = 0; j < colCount; j++){
                boxes[i * 10 + j].innerHTML = "(" + i + ", " + j + ")"   
                if(j == 0 || i == 0 || i == 9 || j == 9 || wall.includes(i * 10 + j)){
                    boxes[i * 10 + j].classList.add("wall");
                }
            }
        }
}

function pickDestination(){
    while(true){
        start = Math.floor(Math.random() * (rowCount * colCount))
        end = Math.floor(Math.random() * (rowCount * colCount))
        //make sure that @start and @end is on different tile and not on a wall
        if(
            start !== end && 
            start > colCount - 1 &&
            end > colCount - 1 &&
            start < (rowCount * colCount - 1 - colCount) && 
            end < (rowCount * colCount - 1 - colCount) && 
            start % colCount !== 0 &&
            end % colCount !== 0 &&
            (start + 1) % colCount !== 0 &&
            (end + 1) % colCount !== 0 &&
            !wall.includes(start) && 
            !wall.includes(end)
        )
        {
            
            boxes[start].classList.add("start")
            boxes[end].classList.add("end")
            break;
        }
    }
    startX = Math.floor(start/10)
    startY = start % 10
    endX = Math.floor(end/10)
    endY = end % 10
    startCor = new Cordinate(startX, startY, 0, 0)
    endCor = new Cordinate(endX, endY, 0, 0)
}
// let startCor = new Cordinate(startX, startY, 0, 0)
// let endCor = new Cordinate(endX, endY, 0, 0)

function typeOf(cordinateObj){
    let flatCordinate = cordinateObj.x * colCount + cordinateObj.y
    
    if(boxes[flatCordinate].classList.contains("wall")){
        return "wall"
    }
    if(boxes[flatCordinate].classList.contains("start")){
        return "start"
    }
    if(boxes[flatCordinate].classList.contains("end")){
        return "end"
    }
    return "box"
}

function initAStar(){
    openList.push(startCor)
    while(openList.length !== 0){
        
        // find the node with the least f
        let minFInd = 0
        let minF = Infinity
        for(let i = 0; i < openList.length; i++){
            if(openList[i].f < minF){
                minF = openList[i].f
                minFInd = i
            }
        }
        //found minF and ind
        // remove it from openList
        let current = openList.splice(minFInd, 1)[0]
        // add it to closedList
        closedList.push(current)
        if(typeOf(current) == "end"){
            console.log(closedList)
            return
        }
        //generate children
        current.genChildren()
        // console.log(current.children)
        //loop through current's children
        let children = current.children
        for(let i = 0; i < children.length; i++){
            if(isInList(children[i], closedList)){
                continue
            }
            children[i].g = current.g + 1
            children[i].h = Math.abs(children[i].x - current.x) + Math.abs(children[i].y - current.y)
            children[i].f = children[i].g + children[i].h
            let willContinue = false
            for(let j = 0; j < openList.length; j++){
                if(children[i].isSame(openList[j]) && children[i].g > openList[j].g){
                    willContinue = true
                    break
                }
            }
            if(willContinue){
                continue
            }
            openList.push(children[i])
        }

    }
}

function calManhattan(corObj){

}

function isInList(corObj, corList){
    for(let i = 0; i < corList.length; i++){
        if(corObj.isSame(corList[i])){
            return true
        }
    }
    return false
}

function init(){
    buildWalls()
    pickDestination()
    initAStar()

}







init()