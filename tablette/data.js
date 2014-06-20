const svgns = "http://www.w3.org/2000/svg";

var data = {};
data.level = {};

data.level.background = [
["C", "C", "B", "B", "B", "B", "B", "B", "R", "G"],
["C", "P", "C", "B", "B", "B", "R", "P", "R", "B"],
["C", "Y", "C", "B", "B", "B", "R", "R", "B", "B"],
["R", "R", "B", "B", "C", "C", "C", "P", "P", "B"],
["P", "R", "R", "C", "C", "C", "Q", "Q", "P", "B"],
["B", "P", "Q", "R", "C", "C", "C", "Q", "C", "B"],
["B", "P", "P", "Y", "R", "C", "Q", "C", "B", "B"],
["P", "P", "Q", "P", "R", "C", "C", "Q", "P", "P"],
["P", "Q", "P", "B", "B", "R", "P", "P", "P", "P"],
["B", "R", "R", "P", "P", "R", "Q", "O", "O", "O"],
["B", "B", "R", "Q", "P", "R", "P", "Y", "O", "B"],
["G", "B", "P", "P", "P", "R", "P", "O", "B", "G"]];

/*C : circle
  R : square
  T : triangle
  S : star*/

data.level.symb = [
[" ", " ", "S", " ", " ", " ", " ", " ", " ", "C"],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
["S", " ", " ", " ", " ", " ", " ", " ", " ", " "]];

//data.level.ground = {"B" : "L"};
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
["G1",-1,"!Q",""],
["2",-1,"",""],
["F1",-1,"!Grey",""],
["G2",2,"",""],
["R",-1,"",""],
["F1",-1,"",""],
["3",-1,"",""],
["F1",-1,"",""],
["G4",-1,"R","C"],
["G3",-1,"",""],
["4",-1,"",""]];//*/


data.level.ground = {};
data.level.ground.color = {"B" : "A"};
data.level.ground.symb = {};
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
data.map.color = {"O" : "rgb(255, 102, 0)", "R" : "rgb(255,0,0)", "B" : "rgb(0,0,255)", "C" : "rgb(0, 255, 255)", "P" : "rgb(191, 0, 255)", "Q" : "rgb(255, 190, 200)", "Y" : "rgb(255, 255, 0)", "G" : "rgb(0, 255, 0)", "A" : "rgb(0,0,0)", "W" : "rgb(255,255,255)"};
data.map.symbcolor = "rgb(0, 0, 0)";
data.map.symbbngcolor = "rgb(255,255,255)";
data.map.symb = {"C" : "circle", "R" : "square", "T" : "triangle", "S" : "star"};
data.map.ground = {"S" : "sand", "A" : "space", "I" : "ice", "W" : "wall", "L" : "lava"};

data.map.colordefault = "rgb(0,0,255)";
data.map.direction = {"E" : 0, "NE" : 1, "NW" : 2, "W" : 3, "SW" : 4, "SE" : 5};

