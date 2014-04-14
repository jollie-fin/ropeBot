const svgns = "http://www.w3.org/2000/svg";

var data = {};
data.level = {};

data.level.background = [
["Cyan", "Grey", "Purple", "Grey", "Black", "Grey", "Black", "Grey", "Pink", "Grey", "Purple", "Grey"],
["Yellow", "Grey", "Grey", "Grey", "Black", "Red", "Black", "Black", "Black", "Black", "Grey", "Black"],
["Black", "Red", "Yellow", "Grey", "Red", "Grey", "Grey", "Purple", "Black", "Red", "Blue", "Grey"],
["Grey", "Grey", "Red", "Black", "Black", "Black", "Green", "Purple", "Pink", "Pink", "Grey", "Black"],
["Purple", "Grey", "Grey", "Red", "Grey", "Black", "Black", "Grey", "Grey", "Grey", "Grey", "Purple"],
["Black", "Purple", "Grey", "Purple", "Red", "Red", "Black", "Black", "Grey", "Purple", "Red", "Black"],
["Black", "Red", "Black", "Grey", "Grey", "Red", "Black", "Black", "Black", "Red", "Purple", "Purple"],
["Black", "Black", "Green", "Grey", "Grey", "Red", "Grey", "Grey", "Black", "Black", "Yellow", "Black"],
["Red", "Grey", "Black", "Purple", "Yellow", "Red", "Grey", "Grey", "Purple", "Black", "Black", "Grey"],
["Pink", "Black", "Grey", "Pink", "Grey", "Grey", "Grey", "Red", "Green", "Purple", "Black", "Black"],
["Grey", "Black", "Purple", "Purple", "Grey", "Black", "Orange", "Pink", "Grey", "Black", "Grey", "Red"],
["Grey", "Grey", "Red", "Grey", "Purple", "Grey", "Black", "Grey", "Purple", "Purple", "Black", "Cyan"]];

/*C : circle
  R : square
  T : triangle
  S : star*/

data.level.symb = [
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", "T", " ", " ", " ", " ", " ", " ", " ", " ", "T", " "],
[" ", " ", " ", " ", "C", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", "C", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", "S", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "T", " "],
[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]];

//data.level.ground = {"Blue" : "L"};
data.level.ground = {"Black" : "I"};
//data.level.ground = {};
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
/*data.program.start = {"x" : 1, "y" : 3, "d" : "up"};
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
["4",-1,"",""]];*/

data.program.start = {"x" : 6, "y" : 7, "d" : "up"};
data.program.content = [
["F1",-1,"",""],
["R",-1,"",""],
["R",-1,"",""],
["N",-1,"",""],
["F1",-1,"",""],
["L",-1,"",""],
["F1",-1,"",""],
["R",-1,"",""],
["F1",-1,"",""],
["R",-1,"",""],
["R",-1,"",""]];

data.map = {};
data.map.color = {"Orange" : "rgb(255, 141, 0)", "Red" : "rgb(255,0,0)", "White" : "rgb(255,255,255)", "Blue" : "rgb(0,0,196)", "Cyan" : "rgb(54, 247, 255)", "Grey" : "rgb(185, 185, 185)", "Purple" : "rgb(133, 49, 109)", "Black" : "rgb(0, 0, 0)", "Pink" : "rgb(255, 93, 141)", "Yellow" : "rgb(255, 241, 43)", "Green" : "rgb(0, 245, 4)"};
data.map.symbcolor = {"Orange" : "rgb(255, 255, 255)", "Red" : "rgb(255, 255, 255)", "White" : "rgb(0, 0, 0)", "Blue" : "rgb(255, 255, 255)", "Cyan" : "rgb(0, 0, 0)", "Grey" : "rgb(255, 255, 255)", "Purple" : "rgb(255, 255, 255)", "Black" : "rgb(255, 255, 255)", "Pink" : "rgb(0, 0, 0)", "Yellow" : "rgb(0, 0, 0)", "Green" : "rgb(0, 0, 0)"};
data.map.symb = {"C" : "circle", "R" : "square", "T" : "triangle", "S" : "star"};
data.map.ground = {"S" : "sand", "A" : "space", "I" : "ice", "W" : "wall", "L" : "lava"};

data.map.colordefault = "rgb(0,0,255)";
data.map.symbcolordefault = "rgb(255,255,255)";
data.map.direction = {"up" : 0, "left" : 3, "down" : 2, "right" : 1};

