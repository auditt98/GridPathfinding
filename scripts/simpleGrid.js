/*modify the function so that it takes in a map from a text file, with 
count of columns and rows to be variables. 
output traced route into a file
properly implement A*

how to avoid high traffic?
do we treat it as a wall?


*/
class Cordinate{
    constructor(x, y, count){
        this.x = x
        this.y = y
        this.count = count
    }
    isSame(cordinateObj){
        if(this.x === cordinateObj.x && this.y === cordinateObj.y){
            return true
        } else{
            return false
        }
    }
}


let boxes = document.getElementsByClassName("box")
let wall = [14, 21, 22, 24, 25, 34, 37, 51, 52, 53, 57, 62, 65, 66, 67, 74, 75, 77]
// let wall = []
let rowCount = 10;
let colCount = 10;
let mainList = []
//initial value for start cordinate and end cordinate
let start = 0
let startX = 0
let startY = 0
let end = 0
let endX = 0
let endY = 0
let startCor = ""
let endCor = ""

//calculate manhattan distance between two cells - used in a*
function calculateManhattan(current, goal){
    return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y) 
}

//build the wall and make mexico pay for it
function buildWalls(){
    for(let i = 0; i < rowCount; i++){
        for(let j = 0; j < colCount; j++){
            // boxes[i * 10 + j].innerHTML = "(" + i + ", " + j + ")"   
            if(j == 0 || i == 0 || i == 9 || j == 9 || wall.includes(i * 10 + j)){
                if(!boxes[i * 10 + j].classList.contains("wall")){
                    boxes[i * 10 + j].classList.add("wall");
                }
            }
        }
    }
}

function initStartAndEnd(){
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
    startCor = new Cordinate(startX, startY, 0)
    endCor = new Cordinate(endX, endY, 0)
}
//check whether a cell at a cordinate is a wall, start , end or empty

function checkType(){
    // checkType(cordinate object)
    if(arguments.length == 1){
        if(arguments[0] instanceof(Cordinate)){
            let flatCordinate = arguments[0].x * colCount + arguments[0].y
            console.log(arguments[0])
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
    } 
    // checktype(x, y)
    if(arguments.length == 2){
        if(arguments[0] instanceof(Number) && arguments[1] instanceof(Number)){
            let flatCordinate = arguments[0] * colCount + arguments[1] //x * colCount + y
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
    } 
    return false;
}

function addToMain(cordinateObj){
    if(checkType(cordinateObj) === "wall"){
        return false
    }
    for(let i = 0; i < mainList.length; i++){
        if(cordinateObj.isSame(mainList[i]) && cordinateObj.count > mainList[i].count){
            return false
        }
    }
    mainList.push(cordinateObj)
    return true
}

function traceRoute(){
    let end = mainList[mainList.length - 1]
    let tracedRoute = []
    let done = false
    // tracedRoute.push(end)
    while(!done){
        if(end === mainList[0]){
            break
        }
        let tempList = []
        let tempUp = new Cordinate(end.x - 1, end.y, 0)
        let tempRight = new Cordinate(end.x, end.y + 1, 0)
        let tempDown = new Cordinate(end.x + 1, end.y, 0)
        let tempLeft = new Cordinate(end.x, end.y - 1, 0)
        for(let j = 0; j < mainList.length; j++){
            if(tempUp.isSame(mainList[j])){
                tempList.push(mainList[j])
            }
            if(tempRight.isSame(mainList[j])){
                tempList.push(mainList[j])
            }
            if(tempDown.isSame(mainList[j])){
                tempList.push(mainList[j])
            }
            if(tempLeft.isSame(mainList[j])){
                tempList.push(mainList[j])
            }
        }
        let minCount = tempList[0].count
        let minCountIndex = 0
        for(let j = 0; j < tempList.length; j++){
            if(tempList[j].count < minCount){
                minCount = tempList[j].count
                minCountIndex = j
            }
        }
        end = tempList[minCountIndex]
        //got minCountIndex
        if(end.isSame(endCor)){
            break
        }
        tracedRoute.push(tempList[minCountIndex])
    }
    console.log("traced")
    console.log(tracedRoute)
    for(let i = 0; i < tracedRoute.length; i++){
        let ind = tracedRoute[i].x * rowCount + tracedRoute[i].y
        boxes[ind].classList.add("traced")
    }
}

function finderStart(){
    let temp = new Cordinate(endX, endY, 0)
    mainList.push(temp);
    //replace foreach with while
    let i = 0
    while(i < mainList.length){
        let cor = mainList[i]
        let tempList = []
        let tempUp = new Cordinate(cor.x - 1, cor.y, cor.count + 1)
        let tempRight = new Cordinate(cor.x, cor.y + 1, cor.count + 1)
        let tempDown = new Cordinate(cor.x + 1, cor.y, cor.count + 1) 
        let tempLeft = new Cordinate(cor.x, cor.y - 1, cor.count + 1)
        addToMain(tempUp)
        if(tempUp.isSame(startCor)){ 
            break 
        }
        addToMain(tempRight)
        if(tempRight.isSame(startCor)){ 
            break 
        }
        addToMain(tempDown)
        if(tempDown.isSame(startCor)){ 
            break 
        }
        addToMain(tempLeft)
        if(tempLeft.isSame(startCor)){ 
            break
        }
        i++
    }
    console.log(mainList)
    for(let j = 0; j < mainList.length; j++){
        let arrIndex = mainList[j].x * rowCount + mainList[j].y;
        boxes[arrIndex].innerHTML = mainList[j].count 
    }
}


function init(){
    buildWalls()
    initStartAndEnd()
    finderStart()
    traceRoute()
}

function move(event){
    // up: 87, down: 83, left: 65, right: 68
    let direction = event.keyCode
    if(direction == 87 || direction == 83 || direction == 65 || direction == 68){
        let moveDirText = document.getElementById("moveKey")
        mainList = []
        let oldStart = startCor

        //need to check if moving in a direction hit a wall
        let tempStart
        if(direction == 87){
            moveDirText.innerHTML = "UP"
            tempStart = new Cordinate(oldStart.x - 1, oldStart.y, 0)
            
        }
        if(direction == 83){
            moveDirText.innerHTML = "DOWN"
            tempStart = new Cordinate(oldStart.x + 1, oldStart.y, 0)
        }
        if(direction == 65){
            moveDirText.innerHTML = "LEFT"
            tempStart = new Cordinate(oldStart.x, oldStart.y - 1, 0)
        }
        if(direction == 68){
            moveDirText.innerHTML = "RIGHT"
            tempStart = new Cordinate(oldStart.x, oldStart.y + 1, 0)
        }
        if(checkType(tempStart) != "wall"){
            startCor = tempStart
            for(let i = 0; i < boxes.length; i++){
                if(boxes[i].classList.contains("start")){
                    boxes[i].classList.remove("start")
                }
                if(boxes[i].classList.contains("traced")){
                    boxes[i].classList.remove("traced")
                }
                boxes[i].innerHTML = ""
            }
            boxes[startCor.x * rowCount + startCor.y].classList.add("start")
            finderStart()
            traceRoute()
        }
    }
    
    
}




function reset(){
    mainList = []
    start = 0
    startX = 0
    startY = 0
    end = 0
    endX = 0
    endY = 0
    startCor = ""
    endCor = ""
    for(let i = 0; i < boxes.length; i++){
        if(boxes[i].classList.contains("start")){
            boxes[i].classList.remove("start")
        }
        if(boxes[i].classList.contains("end")){
            boxes[i].classList.remove("end")
        }
        if(boxes[i].classList.contains("traced")){
            boxes[i].classList.remove("traced")
        }
        boxes[i].innerHTML = ""
    }
    init()
}
init()

