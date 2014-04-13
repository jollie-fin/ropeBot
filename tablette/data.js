const svgns = "http://www.w3.org/2000/svg";

var background = [
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

var symb = [
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

/*
TL : turn left
TR : turn right
FW : forward
FWX : forward X tiles
BW : backward
BW : backward X tiles
LX : label X
GX : goto label X
*/

var startingposition = {"x" : 3, "y" : 3, "d" : "up"};
var program = [
["R",-1,"",""],
["F1",-1,"",""],
["1",-1,"",""],
["F3",-1,"",""],
["R",-1,"",""],
["G1",2,"",""]];

var mapcolor = {"Orange" : "rgb(255, 141, 0)", "Red" : "rgb(255,0,0)", "White" : "rgb(255,255,255)", "Blue" : "rgb(0,0,196)", "Cyan" : "rgb(54, 247, 255)", "Grey" : "rgb(185, 185, 185)", "Purple" : "rgb(133, 49, 109)", "Black" : "rgb(0, 0, 0)", "Pink" : "rgb(255, 93, 141)", "Yellow" : "rgb(255, 241, 43)", "Green" : "rgb(0, 245, 4)"};
var mapsymbcolor = {"Orange" : "rgb(255, 255, 255)", "Red" : "rgb(255, 255, 255)", "White" : "rgb(0, 0, 0)", "Blue" : "rgb(255, 255, 255)", "Cyan" : "rgb(0, 0, 0)", "Grey" : "rgb(255, 255, 255)", "Purple" : "rgb(255, 255, 255)", "Black" : "rgb(255, 255, 255)", "Pink" : "rgb(0, 0, 0)", "Yellow" : "rgb(0, 0, 0)", "Green" : "rgb(0, 0, 0)"};
var mapsymb = {"C" : "circle", "R" : "square", "T" : "triangle", "S" : "star"};

var mapcolordefault = "rgb(0,0,255)";
var mapsymbcolordefault = "rgb(255,255,255)";
var mapdirection = {"up" : 0, "left" : 1, "down" : 2, "right" : 3};

