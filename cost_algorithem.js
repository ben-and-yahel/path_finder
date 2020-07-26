//---------------algorithem A() functions------------------
  /*
  calculate the distance between 2 points
  */
 function distance(A,B)
 {
     return Math.sqrt((Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)))*100;
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
   //   let f = nodeArray[0].point.F_cost;
   //   for (let X = 0; X < nodeArray.length; X++) {
   //       for (let Y = 0; Y < nodeArray.length - 1; Y++) {
   //           if((nodeArray[Y].point.F_cost == f) && (nodeArray[Y].point.H_cost > nodeArray[Y + 1].point.H_cost))
   //           {
   //               let temp = nodeArray[Y + 1];
   //               nodeArray[Y + 1] = nodeArray[Y];
   //               nodeArray[Y] = temp;
   //           }
             
   //       }
   //   }
     return nodeArray;
 }
 /*
 main function of the algorithm
 using linked list
 */
 function A_algorithm()
 {
     let firsts = [];
     let startNode = new Node(start,null);
     let NodesArray = ExpandArray(startNode);//initiate the nodews array with the start point
     // startNode => start || NodesArray => [up, down, left, right]
     let bestTrace = null; 
     var exit = true;
     NodesArray.forEach(n => {//checking if the start is a neighbore of the end
             if(haveReachTheEnd(n)){
                 bestTrace = new Node(end,n);
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
             if(haveReachTheEnd(n)){
                 bestTrace = new Node(end,n);
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
     }
     //alert("time took: "+(time2.getMilliseconds()-time1.getMilliseconds())+" mill sec");
     return bestTrace;
 }
 function haveReachTheEnd(endNode)
 {
     let x = endNode.point.x;
     let y = endNode.point.y;
     let exitX = (end.x == x + 1 || end.x == x - 1) && end.y == y;
     let exitY = (end.y == y + 1 || end.y == y - 1) && end.x == x;
     return exitX || exitY;
 }