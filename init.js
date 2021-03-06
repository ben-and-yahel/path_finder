function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

window.onload =function() {
    dynamicallyLoadScript("cost_algorithem.js");
    dynamicallyLoadScript("button_functions.js");
    dynamicallyLoadScript("path_draw.js");
    dynamicallyLoadScript("star_algorithm.js");

    document.addEventListener("keypress",draw_path);
    document.oncontextmenu = onClick;
    canv=document.getElementById("gc");
    ctx = canv.getContext("2d");
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - strap_height;
    init();
    
}

class Point{
    constructor(x, y, color="grey"){
        this.x = x;
        this.y = y;
        this.color = color;
        this.H_cost = 0; //distance between the end point and another point
        this.G_cost = 0;//distance between the start point and another point
        this.F_cost = 0;// the sum of g cost and h cost
    }
    upgrade(depth) {
        this.H_cost = calculateHcost(this);
        this.G_cost = calculateGcost(this);
        this.G_cost = (this.G_cost + depth*100) / 2.0;
        this.F_cost = this.H_cost*0.7 + this.G_cost*0.3;
    }
}
class Node{
    constructor(p,n){
        this.point = p;
        this.node = n;
        this.depth = 0;
        if(n != null)
        {
            this.depth = n.depth + 1;
        }
    }
    upgrade() {
        this.point.upgrade(this.depth);
    }

}
strap_height = 138;
height = width = 20;
algorithem_mind = []; // mind => [[stage],[stage]], stage => [[x,y],[x,y]]
seperate = 1;
squars = []; // square => [color]
startExist = false;
start = end = undefined;
isAnimate = true;
algorithem_number = 1;
stage_index = 0;
full_line_mark = false;
square_animation_index = 0;
animate_square = undefined;
animation_rate = 70;
cornerRadius = 15;
var debug_mode; // declare it because debug.html declare it anyways
// ----------------init functions--------------------

function init() {
    //makes the squars
    for (let i = 0; i < ctx.canvas.width/width; i++) {
        tmp_squars_line = [];
        for (let j = 0; j < ctx.canvas.height/height; j++) {
            //ctx.fillRect(i+seperate, j+seperate, width, height);
            //TODO: change all the code to points instead of just string
            tmp_squars_line.push(["grey"]); // i,j is location | false is for isBarriar     
        } 
        squars.push(tmp_squars_line);      
    }
    printSquares(squars);
}
//make the animation of sqaure been choosen
function draw_square(point) {
    squars[point.x][point.y] = point.color;
    ctx.fillStyle = point.color;
    ctx.strokeStyle = point.color;
    ctx.fillRect((point.x*width+width/4)-square_animation_index/2,
                (point.y*height+height/4)-square_animation_index/2,
                (width-seperate)/2+square_animation_index,
                (height-seperate)/2+square_animation_index);
    square_animation_index +=1;
    if (square_animation_index > (height/2)-seperate-6) {
        square_animation_index = 0;

        // ctx.strokeRect(point.x*width+(cornerRadius/2), point.y*height+(cornerRadius/2), width-cornerRadius-seperate, height-cornerRadius-seperate);
        // ctx.fillRect(point.x*width+(cornerRadius/2), point.y*height+(cornerRadius/2), width-cornerRadius-seperate, height-cornerRadius-seperate);
        ctx.fillRect(point.x*width, point.y*height, width-seperate, height-seperate);
        clearInterval(animate_square);
        return;
    }
}
//check colum if all black
function row_color(x) {
        for (let y = 0; y < squars[x].length; y++) {
            if(squars[x][y] != "black"){
                return false;
            }
        }
    return true;
}
function clearBoard() {
    for (let i = 0; i < squars.length; i++) {
        for (let j = 0; j < squars[i].length; j++) {
            if (squars[i][j] != "black" && squars[i][j] != "grey"  && squars[i][j] != "blue"  && squars[i][j] != "red" ) {
                squars[i][j] = "grey";
            }
        }
    }
}
/*TODO: require doc!! */
function onClick(e) {
    square_animation_index = 0;
    clearInterval(animate_square);
    pageShift = 65;
    clicX = e.pageX;
    clicY = e.pageY-pageShift;
    isChanged = false;
    for (let x = 0; x < squars.length; x++) {
        let is_grey_row = row_color(x);
        for (let y = 0; y < squars[x].length; y++) {
            if (e.button==2 && (squars[x][y] == "blue" || squars[x][y] == "red")) {
                if (squars[x][y] == "blue" && !startExist) {
                    squars[x][y] = "grey";
                }
                else if (squars[x][y] == "red" && startExist) {
                    squars[x][y] = "grey";
                }
            }
            //draw a full row of squares
            else if(full_line_mark && clicX >= x*width && clicX <= x*width+width-seperate && e.button!=2)
            {
                //update_square(new Point(x, y, "black"))
                if (is_grey_row) {
                    squars[x][y] = "grey";
                }
                else
                {
                    squars[x][y] = "black";
                }
                
                continue;
            }
            if (clicX >= x*width && clicX <= x*width+width-seperate 
                && clicY >= y*height && clicY <= y*height+height-seperate) {
                    if (e.button == 2) {
                        //if there is start so it gone to red for end
                        if (startExist) {
                            end = new Point(x, y, "red");
                            update_square(end);
                        }
                        else
                        {
                            start = new Point(x, y, "blue");
                            update_square(start);
                        }
                        isChanged = true;// if endpoint is set we update it in the end of the func
                    }
                    else if (squars[x][y] != "grey") {
                        update_square(new Point(x, y, "grey"));
                    }
                    //the squre is grey and about to be black
                    else{
                        if (debug_mode) {
                            h = document.getElementById("welcome");
                            h.innerHTML  = "y:"+y+" x:"+x;
                        }
                        //calc_HGF_cost(x,y);
                        update_square(new Point(x, y, "black"));
                    }
                    
            }        
        }
    }
    printSquares();
    isChanged ? startExist = !startExist : false;
    isChanged = false;
    return false;
}
function update_square(point) {
    animate_square = setInterval(draw_square,1000/animation_rate,point);
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

    if (end == undefined) {
        alert("please enter start and end point(right mouse click)!");
        return;
    }
    stage_index = 0;
    clearBoard();
    algorithem_mind = [];
    let result = [];
    var t0 = performance.now()
    switch (algorithem_number) {
        case 1:
            result = A_algorithm();
            break;
        case 2:
            result = star_algorithm();
            break;
        default:
            break;
    }
    var t1 = performance.now()
    if(result != null){
        result = result.node;
    squars[end.x][end.y] = "red";
    squars[start.x][start.y] = "blue";
    path_result = result;
    }
    //alert("Call to doSomething took " + (t1 - t0)/1000 + " seconds.");
    
    
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