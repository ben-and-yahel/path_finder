window.onload =function() {
    document.addEventListener("keypress",draw_path);
    //document.addEventListener("click", onClick);
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
        this.F_cost = this.H_cost + this.G_cost;
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
height = width = 50;
algorithem_mind = []; // mind => [[stage],[stage]], stage => [[x,y],[x,y]]
seperate = 1;
squars = []; // square => [color]
startExist = false;
start = end = undefined;
isAnimate = true;
algorithem_number = 1;
let stage_index = 0;
//-----------------button functions-------------------
function animation() {
    let txt = "Animation &#973";
    isAnimate = !isAnimate;
    document.getElementById("animation").innerHTML = !isAnimate? txt+"4;":  txt+"3;";
}
function template() {
    color = "black";
    if (start != undefined) {
        squars[start.x][start.y] = "grey";
    }
    if (end != undefined) {
        squars[end.x][end.y] = "grey";
    }
    for (let i = 0; i < squars.length; i+=2) {
        for (let j = 0; j < squars[i].length-1; j+=2) {
            squars[i][j] = color;
        }
    }
    squars[1][0] = "blue";
    start = new Point(1, 0);
    squars[7][6] = "red";
    end = new Point(7, 6);
    printSquares();
}
//algorithem = 
function algorithem(number) {
    algorithem_number = number;
    alert("you choose algorithem number "+number);
}
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


function draw_animation() {
    if (path_result.node == null || stage_index != -1) {
        return false;
    }
    
    squars[path_result.point.x][path_result.point.y] = "#00ffcc";  
    path_result = path_result.node;
    printSquares();
}

//---------------algorithem A() functions------------------
  /*
  calculate the distance between 2 points
  */
  function distance(A,B)
  {
      return Math.floor(Math.sqrt((Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2))))*10;
  }
  /*
  calculate the distance between the start point and another point
  */
  function calculateGcost(P)
  {
      return distance(P,start)
  }
  /*
  calculate the distance between the end point and another point
  */
  function calculateHcost(P)
  {
      return distance(P,end)
  }
  /*
  go through a node and search for a givven point
  */
  function haventBeenThere(x,y,ExpendedNode)
  {
      let curr = ExpendedNode;
      while (curr)
      {
          if(curr.point.x == x && curr.point.y == y)
              return false;
          curr = curr.node;
      }
  
      return true;
  }
  /*
  expanding searching area
  return an array of nodes
  */
  function ExpandArray(ExpendedNode)
  {
      let NodesArray = [];
      let width = squars.length;
      let height = squars[0].length;
      let x = ExpendedNode.point.x;
      let y = ExpendedNode.point.y;
      //check if posible to go there and then create and push a new node
      if(x-1 >= 0 && squars[x-1][y] != "black" && haventBeenThere(x-1,y,ExpendedNode))
          NodesArray.push(new Node(new Point(x-1,y,"green"),ExpendedNode));
      if(x+1 < width && squars[x+1][y] != "black" && haventBeenThere(x+1,y,ExpendedNode))
          NodesArray.push(new Node(new Point(x+1,y,"green"),ExpendedNode));
      if(y-1 >= 0 && squars[x][y-1] != "black" && haventBeenThere(x,y-1,ExpendedNode))
          NodesArray.push(new Node(new Point(x,y-1,"green"),ExpendedNode));
      if(y+1 < height && squars[x][y+1] != "black" && haventBeenThere(x,y+1,ExpendedNode))
          NodesArray.push(new Node(new Point(x,y+1,"green"),ExpendedNode));
    let tmp_stage = [];
      for (let index = 0; index < NodesArray.length; index++) {
        NodesArray[index].upgrade();
        tmp_stage.push(NodesArray[index].point);//mark the way:)
      }
      algorithem_mind.push([tmp_stage]);
          
      return NodesArray;
  }
  /*
  sorting the nodes by their F cost
  then by their H cost
  */
  function sortByFcost(nodeArray)
  {
      for (let X = 0; X < nodeArray.length; X++) {
          for (let Y = 0; Y < nodeArray.length - 1; Y++) {
              if(nodeArray[Y].point.F_cost > nodeArray[Y + 1].point.F_cost)
              {
                  let temp = nodeArray[Y + 1];
                  nodeArray[Y + 1] = nodeArray[Y];
                  nodeArray[Y] = temp;
              }
              else if((nodeArray[Y].point.F_cost == nodeArray[Y + 1].point.F_cost) && (nodeArray[Y].point.H_cost < nodeArray[Y + 1].point.H_cost))
              {
                  let temp = nodeArray[Y + 1];
                  nodeArray[Y + 1] = nodeArray[Y];
                  nodeArray[Y] = temp;
              }
          }
      }
      let f = nodeArray[0].point.F_cost;
      for (let X = 0; X < nodeArray.length; X++) {
          for (let Y = 0; Y < nodeArray.length - 1; Y++) {
              if((nodeArray[Y].point.F_cost == f) && (nodeArray[Y].point.H_cost > nodeArray[Y + 1].point.H_cost))
              {
                  let temp = nodeArray[Y + 1];
                  nodeArray[Y + 1] = nodeArray[Y];
                  nodeArray[Y] = temp;
              }
              
          }
      }
      return nodeArray;
  }
  /*
  main function of the algorithm
  using linked list
  */
  function A_algorithm()
  {
    var time1 = new Date();
      let firsts = [];
      let startNode = new Node(start,null);
      let NodesArray = ExpandArray(startNode);//initiate the nodews array with the start point
      // startNode => start || NodesArray => [up, down, left, right]
      let bestTrace = null; 
      var exit = true;
      NodesArray.forEach(n => {//checking if the start is a neighbore of the end
              if(n.point.x == end.x && n.point.y == end.y){
                  bestTrace = n; 
                  exit = false;
              }
      });
      while(exit)
      {
          if(NodesArray.length == 0){
              exit = false;
              squars[end.x][end.y] = "yellow"
              squars[start.x][start.y] = "yellow"
              alert("no path avalible!");
              continue;
          }
          NodesArray = sortByFcost(NodesArray);//searching for the closest to the end
          tempNodeArray = ExpandArray(NodesArray[0]);
          firsts.push(NodesArray.splice(0,1)); // array: [1,2,3,4] splice(0,1) : [1]
          NodesArray.push.apply(NodesArray,tempNodeArray);//adding next gen
          var i = 0;
          NodesArray.forEach(n => {//making progress, sign it and check if finish
              if(n.point.x == end.x && n.point.y == end.y){
                  bestTrace = n; 
                  exit = false;
              }
              firsts.forEach(first => {//checking for false run - removing create a minor bug
                  if(first[0].point.x == n.point.x && first[0].point.y == n.point.y){
                      NodesArray.splice(i,1);
                  }
              });
              i++;
          });
          //printSquares();
          console.log(NodesArray)
      }
      let time2 = new Date();
      alert("time took: "+((time2.getMilliseconds()-time1.getMilliseconds()))+" mill sec");
      return bestTrace;
  }
function draw_path(e) {
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
        algorithem_mind.splice(-1,1)
        var draw = setInterval(function () {
            algorithem_mind[stage_index].forEach(stage => {
                stage.forEach(point =>{
                    squars[point.x][point.y] = "yellow";
                })
            });
            if (stage_index >= algorithem_mind.length-1) {
                stage_index = -1;
                setInterval(draw_animation, 1000/15);
                clearInterval(draw);
                return;
            }
            stage_index +=1;
            printSquares();
        }, 1000/10);
        //TODO: interval bug!!
        //setInterval(draw_animation, 1000/15);
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