function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

window.onload =function() {
    dynamicallyLoadScript("cost_algorithem.js");
    dynamicallyLoadScript("button_functions.js");
    dynamicallyLoadScript("path_draw.js");

    document.addEventListener("keypress",draw_path);
    document.oncontextmenu = onClick;
    canv=document.getElementById("gc");
    ctx = canv.getContext("2d");
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - strap_height;
    init();
    
}

class Point{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.H_cost = 0; //distance between the end point and another point
        this.G_cost = 0;//distance between the start point and another point
        this.F_cost = 0;// the sum of g cost and h cost
    }
    upgrade() {
        this.H_cost = calculateHcost(this);
        this.G_cost = calculateGcost(this);
        this.F_cost = this.H_cost*0.6 + this.G_cost*0.4;
    }
}
class Node{
    constructor(p,n){
        this.point = p;
        this.node = n;
    }
    upgrade() {
        this.point.upgrade();
    }

}
strap_height = 138;
height = width = 30;
algorithem_mind = []; // mind => [[stage],[stage]], stage => [[x,y],[x,y]]
seperate = 1;
squars = []; // square => [color]
startExist = false;
start = end = undefined;
isAnimate = true;
algorithem_number = 1;
stage_index = 0;

// ----------------init functions--------------------
function clearBoard() {
    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            if (squars[i][j] != "black" && squars[i][j] != "grey"  && squars[i][j] != "blue"  && squars[i][j] != "red" ) {
                squars[i][j] = "grey";
            }
        }
    }
}
function onClick(e) {
    pageShift = 65;
    clicX = e.pageX;
    clicY = e.pageY-pageShift;
    isChanged = false;
    for (let x = 0; x < squars.length; x++) {
        for (let y = 0; y < squars[x].length; y++) {
            if (e.button==2 && (squars[x][y] == "blue" || squars[x][y] == "red")) {
                if (squars[x][y] == "blue" && !startExist) {
                    squars[x][y] = "grey";
                }
                else if (squars[x][y] == "red" && startExist) {
                    squars[x][y] = "grey";
                }
                printSquares();
            }
            if (clicX >= x*width && clicX <= x*width+width-seperate 
                && clicY >= y*height && clicY <= y*height+height-seperate) {
                    if (e.button == 2) {
                        //if there is start so it gone to red for end
                        if (startExist) {
                            squars[x][y] =  "red";
                            end = new Point(x, y);
                        }
                        else
                        {
                            squars[x][y] = "blue"; 
                            start = new Point(x, y);
                        }
                        isChanged = true;// if endpoint is set we update it in the end of the func
                    }
                    else if (squars[x][y] != "grey") {
                        squars[x][y] = "grey";
                    }
                    else{
                        squars[x][y] = "black";
                    }
                    printSquares();
            }        
        }
    }
    isChanged ? startExist = !startExist : false;
    isChanged = false;
    return false;
}
function init() {
    //makes the squars
    for (let i = 0; i < ctx.canvas.width/width; i++) {
        tmp_squars_line = [];
        for (let j = 0; j < ctx.canvas.height/height; j++) {
            //ctx.fillRect(i+seperate, j+seperate, width, height);
            tmp_squars_line.push(["grey"]); // i,j is location | false is for isBarriar     
        } 
        squars.push(tmp_squars_line);       
    }
    printSquares(squars);
}
//for loop on every item and show it on the canvas
function printSquares() {
    x = y = 0;
    color = "grey";
    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            color = squars[i][j];
            ctx.fillStyle = color;
            ctx.fillRect(i*width, j*height, width-seperate, height-seperate);
        }
    }
}

function draw_path() {
    stage_index = 0;
    clearBoard();
    algorithem_mind = [];
    let result = [];

    switch (algorithem_number) {
        case 1:
            result = A_algorithm();
            break;
        default:
            break;
    }
    if(result == null){
        printSquares();
        return;
    }

    result = result.node;
    squars[end.x][end.y] = "red";
    squars[start.x][start.y] = "blue";
    path_result = result;
    
    if (isAnimate) {
        draw_animation(result);
    }
    else{
        while(result.node)
        {
            squars[result.point.x][result.point.y] = "#00ffcc";  
            result = result.node;
        }
        printSquares();
    }
    
}