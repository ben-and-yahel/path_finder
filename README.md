# Welcome to our Path finder!

Hi! well, you probably saw a Thousand like that. And for a very good reason! it's such a fun project!
# what is it?

well for the folks who don't know what pathfinding is, it basically a bunch of squares with barriers between them and an algorithm how tries to navigate between them from point A to B.
## Prerequisites
none! (google chrome)
## How to use:

![using description](https://raw.githubusercontent.com/ben-and-yahel/path_finder/master/Hnet-image.gif)

first, choose the start and end point by clicking the right-button on a square. the click will mark the start in blue and the end in red. Now enter some barriers by clicking on the left-button on a square. the click will make black and our path could'et make the way throw them. activate: to activate hit any button on your keyboard.
**activate:**
to activate hit any button on your keyboard.

# The algorithm

**A* algorithm** - The A* path finder algorithm looks at the start and the end point and see what is the way betwen the two point. It doing so by calculating 3 values:
**G cost:** The distance between a point to the start point
**H cost:** The distance between a point to the end point
**F cost:** The sum of G cost and H cost
then the algorithm expand the start point to it's neighbores and follow the path with the lowest F cost.

In our code the paths that the algorithm checks are stored by an array of linked lists when every list is a diffrent path. 

The array is then sorted by the F and H cost(tells us who is closer to the end) and with the closer node we expanding our array. 

The expansion of the nodes is made by the function ExpandArray which create 4 new routs in which the path can grow to. 
When the new paths our made the function then calls the upgrade function on the new nodes which calculate the new costs.

The function stops when the end point was found or if there is nowhere else to go to(there is no path between the start and the end points). 

## bonuses:

we have pleanty feachers in our pathfinder.
1. algorithm picker - pick the pathfinding algorithm
2. reload button - reload your page
3. animation - choose whenever you'd like to see how the algorithm thinks
4. template - generate a template for the algorithm
5. select row - a tool for select a whole row
## what we learn from this project?

In this project, we learn a new language: javascript, and we sharped our algorithms thinking skills.
We also learn how to use css positoning and html basic use. We very enjoind from this project because it's intuitiv and fun to show and use.**Very recommended**
