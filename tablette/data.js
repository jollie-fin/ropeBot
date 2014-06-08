const svgns = "http://www.w3.org/2000/svg";

var data = {};
data.level = {};

data.level.background = [
["Cyan", "Cyan", "Blue", "Blue", "Blue", "Red", "Blue", "Pink", "Blue", "Orange", "Blue", "Green"],
["Cyan", "Blue", "Blue", "Red", "Blue", "Blue", "Blue", "Pink", "Blue", "Orange", "Blue", "Blue"],
["Cyan", "Pink", "Pink", "Blue", "Red", "Blue", "Yellow", "Red", "Orange", "Pink", "Pink", "Blue"],
["Blue", "Blue", "Purple", "Pink", "Blue", "Cyan", "Orange", "Purple", "Blue", "Pink", "Blue", "Pink"],
["Blue", "Orange", "Orange", "Cyan", "Cyan", "Cyan", "Orange", "Orange", "Cyan", "Blue", "Purple", "Blue"],
["Blue", "Blue", "Blue", "Orange", "Orange", "Cyan", "Cyan", "Cyan", "Orange", "Pink", "Blue", "Blue"],
["Orange", "Blue", "Pink", "Pink", "Cyan", "Orange", "Cyan", "Cyan", "Blue", "Blue", "Blue", "Pink"],
["Blue", "Purple", "Yellow", "Blue", "Cyan", "Cyan", "Cyan", "Orange", "Cyan", "Red", "Yellow", "Blue"],
["Blue", "Red", "Blue", "Blue", "Purple", "Orange", "Cyan", "Cyan", "Purple", "Red", "Blue", "Blue"],
["Yellow", "Pink", "Blue", "Pink", "Pink", "Cyan", "Orange", "Cyan", "Blue", "Pink", "Red", "Blue"],
["Blue", "Blue", "Red", "Blue", "Blue", "Orange", "Red", "Blue", "Red", "Blue", "Blue", "Blue"],
["Green", "Blue", "Purple", "Blue", "Blue", "Orange", "Red", "Blue", "Blue", "Blue", "Blue", "Green"]];

/*C : circle
  R : square
  T : triangle
  S : star*/

data.level.symb = [
["S", "C", "S", "T", "C", "S", "R", "S", "C", "C", "S", "C"],
["R", "R", "R", "T", "T", "C", "R", "S", "R", "C", "C", "T"],
["R", "C", "C", "T", "R", "T", "T", "R", "T", "S", "S", "R"],
["T", "T", "T", "R", "S", "S", "T", "R", "S", "S", "S", "S"],
["T", "S", "C", "R", "T", "R", "T", "C", "C", "C", "T", "T"],
["T", "S", "C", "C", "S", "C", "R", "S", "S", "T", "C", "S"],
["R", "C", "S", "T", "S", "C", "R", "C", "C", "S", "S", "T"],
["C", "C", "R", "R", "T", "S", "T", "C", "C", "R", "C", "R"],
["S", "R", "C", "C", "R", "C", "C", "R", "C", "R", "C", "C"],
["C", "T", "T", "T", "C", "R", "R", "T", "C", "C", "C", "S"],
["R", "C", "C", "T", "R", "C", "C", "T", "R", "C", "T", "S"],
["T", "S", "S", "S", "T", "S", "S", "R", "C", "C", "C", "C"]];

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


data.level.ground = {"S" : "L"};
data.level.cost = {"F1" : 1, "B1" : 0, "L" : 1, "R" : 1, "limit" : 2};

data.program.start = {"x" : 11, "y" : 2, "d" : "left"};
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
data.map.direction = {"up" : 0, "left" : 3, "down" : 2, "right" : 1};

