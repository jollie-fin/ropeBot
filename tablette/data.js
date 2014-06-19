const svgns = "http://www.w3.org/2000/svg";

var data = {};
data.level = {};

data.level.background = [
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"],
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange"]];

/*C : circle
  R : square
  T : triangle
  S : star*/

data.level.symb = [
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"],
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C"]];

//data.level.ground = {"Blue" : "L"};
/*
L : turn left
R : turn right
FX : forward X tiles
BX : backward X tiles
LX : label X
GX : goto label X
N : nop
*/

data.program = {};

/*data.level.ground = {};
data.program.start = {"x" : 1, "y" : 3, "d" : "up"};
data.program.content = [
["1",-1,"",""],
["R",-1,"","T"],
["F1",-1,"",""],
["F0",-1,"",""],
["G1",-1,"!Pink",""],
["2",-1,"",""],
["F1",-1,"!Grey",""],
["G2",2,"",""],
["R",-1,"",""],
["F1",-1,"",""],
["3",-1,"",""],
["F1",-1,"",""],
["G4",-1,"Red","C"],
["G3",-1,"",""],
["4",-1,"",""]];//*/


//data.level.ground = {"S" : "L"};
data.level.ground = {};
data.level.cost = {"F1" : 1, "B1" : 0, "L" : 1, "R" : 1, "limit" : 2};

data.program.start = {"x" : 5, "y" : 2, "d" : "E"};
data.program.content = [
//["G1",-1,"",""],//
//["1",-1,"",""],//
["L",-1,"",""],
["B1",-1,"",""],
["L",-1,"",""],
["B1",-1,"",""],
["B1",-1,"",""],
["B1",-1,"",""],
["L",-1,"",""],
["B1",-1,"",""],
["R",-1,"",""],
["B1",-1,"",""],
["L",-1,"",""],
["B1",-1,"",""],
["B1",-1,"",""]
//["N",-1,"",""],//
];

data.map = {};
data.map.color = {"Orange" : "rgb(255, 102, 0)", "Red" : "rgb(255,0,0)", "Blue" : "rgb(0,0,255)", "Cyan" : "rgb(0, 255, 255)", "Purple" : "rgb(128, 0, 128)", "Pink" : "rgb(255, 0, 255)", "Yellow" : "rgb(255, 255, 0)", "Green" : "rgb(0, 255, 0)"};
data.map.symbcolor = {"Orange" : "rgb(0, 0, 0)", "Red" : "rgb(0, 0, 0)", "White" : "rgb(0, 0, 0)", "Blue" : "rgb(0, 0, 0)", "Cyan" : "rgb(0, 0, 0)", "Grey" : "rgb(0, 0, 0)", "Purple" : "rgb(0, 0, 0)", "Black" : "rgb(0, 0, 0)", "Pink" : "rgb(0, 0, 0)", "Yellow" : "rgb(0, 0, 0)", "Green" : "rgb(0, 0, 0)"};
data.map.symbbngcolor = {"Orange" : "rgb(255, 255, 255)", "Red" : "rgb(255, 255, 255)", "White" : "rgb(255, 255, 255)", "Blue" : "rgb(255, 255, 255)", "Cyan" : "rgb(255, 255, 255)", "Grey" : "rgb(255, 255, 255)", "Purple" : "rgb(255, 255, 255)", "Black" : "rgb(255, 255, 255)", "Pink" : "rgb(255, 255, 255)", "Yellow" : "rgb(255, 255, 255)", "Green" : "rgb(255, 255, 255)"};
data.map.symb = {"C" : "circle", "R" : "square", "T" : "triangle", "S" : "star"};
data.map.ground = {"S" : "sand", "A" : "space", "I" : "ice", "W" : "wall", "L" : "lava"};

data.map.colordefault = "rgb(0,0,255)";
data.map.symbcolordefault = "rgb(0,0,0)";
data.map.symbbngcolordefault = "rgb(255,255,255)";
data.map.direction = {"E" : 0, "NE" : 1, "NW" : 2, "W" : 3, "SW" : 4, "SE" : 5};

