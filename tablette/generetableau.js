document.rootElement.addEventListener("SVGLoad", init, false);

function transformfromprogram(start, p)
{
  var repetition = new Array();  

  var x = start["x"];
  var y = start["y"];
  var d = start["d"];

  var delta=[[0,-1],[1,0],[0,1],[-1,0]];
  var dir = 0;
  if (d in mapdirection)
  dir = mapdirection[d];

  var dirangle = 90 * dir;
  var width = 40.;
  var offset = width / 2.;

  var rotate = "";
  var trans = "";
  var keys = new Array();
  var pcs = new Array();
  var iteration = 0;
  var pc = 0;

  for (var i = 0; i < p.length; i++)
    repetition[i] = 0;

  rotateinit = "rotate(" + dirangle + "," + offset + "," + offset + ")";
  transinit = "translate(" + (width*x) + "," + (width*y)+ ")";

  rotate = " " + dirangle + "," + offset + "," + offset;
  trans = " " + (width*x) + "," + (width*y);
  keys[iteration] = 0.;


  while (pc < p.length && iteration < 100)
  {
    if (p[pc][1] == -1 || repetition[pc] < p[pc][1])
    {
      pcs[iteration] = pc;
      if (p[pc][1] != -1)
        repetition[pc]++;

      switch (p[pc][0][0])
      {
        case "L":
          dir--;
          if (dir == -1)
            dir = 3;
          dirangle -= 90;
          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + 1.;
          pc++;
          break;

        case "R":
          dir++;
          if (dir == 4)
            dir = 0;
          dirangle += 90;
          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + 1.;
          pc++;
          break;

        case "F":
          var nb = parseInt(p[pc][0][1]);
          x += nb*delta[dir][0];
          y += nb*delta[dir][1];
          if (x < 0 || x >= 12 || y < 0 || y >= 12)
          {
            pc = p.length;
            break;
          }

          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + 1.;
          pc++;
          break;

        case "B":
          var nb = parseInt(p[pc][0][1]);
          x -= nb*delta[dir][0];
          y -= nb*delta[dir][1];
          if (x < 0 || x >= 12 || y < 0 || y >= 12)
          {
            pc = p.length;
            break;
          }

          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + 1.;
          pc++;
          break;

        case "G":
          var label = p[pc][0][1];
          var i = 0;
          while (i < p.length && p[i][0][0] != label)
            i++;

          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + .2;
          pc = i;
          break;

        default:
          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + .2;
          pc++;
          break;
      }
      iteration++;
    }
    else
    {
      pc++;
    }
  }
  pcs[iteration] = pc;

  var keysstring = "0.";

  var duration = keys[keys.length - 1];

  for (var i = 1; i < keys.length; i++)
  {
    keysstring += "; " + (keys[i] / duration);
  }


  var pcstrans = "0,0";
  for (var i = 1; i < pcs.length; i++)
  {
    pcstrans += "; 0," + pcs[i]*width;
  }
  var pcstransinit = "translate(0,0)";
  

  return {"translate" : trans, "rotate" : rotate, "translateinit" : transinit, "rotateinit" : rotateinit, "duration" : duration, "keys" : keysstring, "pc" : pcs, "pctrans" : pcstrans, "pctransinit" : pcstransinit};
}


function createSymbole(x,y,width,s)
{
  var x = x*width;
  var y = y*width;
  switch (s)
  {
    case "circle":
      var circle = document.createElementNS(svgns, "circle");
      circle.setAttributeNS(null, "cx", x+width/2.);
      circle.setAttributeNS(null, "cy", y+width/2.);
      circle.setAttributeNS(null, "r", width/3.);
      return circle;
    case "square":
      var rect = document.createElementNS(svgns, "rect");
      rect.setAttributeNS(null, "x", x+width/6.);
      rect.setAttributeNS(null, "y", y+width/6.);
      rect.setAttributeNS(null, "width", width*2./3.);
      rect.setAttributeNS(null, "height", width*2./3.);
      return rect;
// triangle
    case "triangle":
      var radius = width * .4;
      var tri = document.createElementNS(svgns, "polygon");
      var points = "";

      for (var i=0; i<3; i++)
      {
        var dx = x+width/2.+radius*Math.cos(Math.PI*(-1./2.+2./3.*i));
        var dy = y+width/2.+radius*0.2+radius*Math.sin(Math.PI*(-1./2.+2./3.*i));
        points = points + dx + "," + dy + " ";
      }

      tri.setAttributeNS(null, "points", points);
      return tri;
//star
    case "star":
      var radius = width * .4;
      var tri = document.createElementNS(svgns, "polygon");
      var points = "";

      for (var i=0; i<5; i++)
      {
        var dx = x+width/2.+radius*Math.cos(Math.PI*(-1./2.+4./5.*i));
        var dy = y+width/2.+radius*Math.sin(Math.PI*(-1./2.+4./5.*i));
        points = points + dx + "," + dy + " ";
      }

      tri.setAttributeNS(null, "points", points);
      return tri;
    default:
      return undefined;
  }
}

function coordNale()
{
  var points = "";
  var width = 40.;
  var radius = 10.;
  
  for (var i=-1; i<2; i++)
  {
    dx = width/2.+radius*Math.cos(Math.PI*(-1./2.+4./5.*i));
    dy = width/2.+radius*Math.sin(Math.PI*(-1./2.+4./5.*i))-radius*0.4;
    points = points + dx + "," + dy + " ";
  }
  return points;
}


function createNale(start, p)
{

  var tri = document.createElementNS(svgns, "polygon");
  var points = coordNale();


  tri.setAttributeNS(null, "points", points);
  tri.setAttributeNS(null, "id", "nale");

  tri.setAttributeNS(null, "style", "fill: orange;stroke:black;stroke-width:1px;");

  var group = document.createElementNS(svgns, "g");

  t = transformfromprogram(start,p);


  duration = t["duration"] * 1.;
  duration = " " + duration + "s";
  var trans = document.createElementNS(svgns, "animateTransform");
  trans.setAttributeNS(null, "id", "naletranslation");
  trans.setAttributeNS(null, "attributeName", "transform");
  trans.setAttributeNS(null, "attributeType", "XML");
  trans.setAttributeNS(null, "type", "translate");
  trans.setAttributeNS(null, "fill", "freeze");
  trans.setAttributeNS(null, "values", t["translate"]);
  trans.setAttributeNS(null, "keyTimes", t["keys"]);
  trans.setAttributeNS(null, "begin", "indefinite");
  trans.setAttributeNS(null, "dur", duration);

  
  var rotate = document.createElementNS(svgns, "animateTransform");
  rotate.setAttributeNS(null, "id", "nalerotation");
  rotate.setAttributeNS(null, "attributeName", "transform");
  rotate.setAttributeNS(null, "attributeType", "XML");
  rotate.setAttributeNS(null, "fill", "freeze");
  rotate.setAttributeNS(null, "type", "rotate");
  rotate.setAttributeNS(null, "values", t["rotate"]);
  rotate.setAttributeNS(null, "keyTimes", t["keys"]);
  rotate.setAttributeNS(null, "begin", "indefinite");
  rotate.setAttributeNS(null, "dur", duration);
  tri.appendChild(rotate);
  tri.setAttributeNS(null, "transform", t["rotateinit"]);

  group.setAttributeNS(null, "transform", t["translateinit"]);
  
  group.appendChild(tri);
  group.appendChild(trans);

  return group;
}

function createMap()
{
  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      var tile = document.createElementNS(svgns, "rect");
      tile.setAttributeNS(null, "x", 40*j);
      tile.setAttributeNS(null, "y", 40*i);
      tile.setAttributeNS(null, "width", 40);
      tile.setAttributeNS(null, "height", 40);
      var color = mapcolordefault;
      if (background[i][j] in mapcolor)
        color = mapcolor[background[i][j]];
      tile.setAttributeNS(null, "style", "fill:"+color+";stroke:black;stroke-width:1px;");
      document.rootElement.appendChild(tile);
    }
  }


  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      var color = mapsymbcolordefault;
      if (background[i][j] in mapsymbcolor)
        color = mapsymbcolor[background[i][j]];

      if (symb[i][j] in mapsymb)
      {
        var symbole = createSymbole(j,i,40,mapsymb[symb[i][j]]);
        if (symbole !== undefined)
        {
          symbole.setAttributeNS(null, "style", "fill:"+color);
          document.rootElement.appendChild(symbole);
        }
      }
    }
  }
  document.rootElement.appendChild(createNale(startingposition,program));
}

function move()
{
	document.getElementById("nalerotation").beginElement();
	document.getElementById("naletranslation").beginElement();
}

function init()
{
  createMap();  
  document.rootElement.addEventListener("click", move, false);
}
