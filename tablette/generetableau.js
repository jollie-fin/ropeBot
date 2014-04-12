document.rootElement.addEventListener("SVGLoad", init, false);

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
  
  for (var i=0; i<3; i++)
  {
    dx = width/2.+radius*Math.cos(Math.PI*(-1./2.+2./3.*i));
    dy = width/2.+radius*Math.sin(Math.PI*(-1./2.+2./3.*i))-radius*0.8;
    points = points + dx + "," + dy + " ";
  }
  return points;
}

function createNale(x, y, d)
{
  var width = 40.;
  var radius = 10.;
  var tri = document.createElementNS(svgns, "polygon");
  var points = coordNale();

  tri.setAttributeNS(null, "points", points);
  tri.setAttributeNS(null, "id", "nale");

  tri.setAttributeNS(null, "style", "fill: orange;stroke:black;stroke-width:1px;");

  var dir = 0.;
  if (d in mapdirection)
  dir = mapdirection[d];

  dir = dir * 90.;
  var x = x * width;
  var y = y * width;

  var dir1 = dir;
  var dir2 = dir+90.;
  var x1 = x;
  var x2 = x;
  var y1 = y;
  var y2 = y+40;
  var offset = width/2.;


  var group = document.createElementNS(svgns, "g");

  var trans = document.createElementNS(svgns, "animateTransform");
  trans.setAttributeNS(null, "id", "naletranslation");
  trans.setAttributeNS(null, "attributeName", "transform");
  trans.setAttributeNS(null, "attributeType", "XML");
  trans.setAttributeNS(null, "type", "translate");
  trans.setAttributeNS(null, "fill", "freeze");
  trans.setAttributeNS(null, "from", x1+", "+y1);
  trans.setAttributeNS(null, "to", x2+", "+y2);
  trans.setAttributeNS(null, "begin", "indefinite");
  trans.setAttributeNS(null, "dur", "1s");

  
  var rotate = document.createElementNS(svgns, "animateTransform");
  rotate.setAttributeNS(null, "id", "nalerotation");
  rotate.setAttributeNS(null, "attributeName", "transform");
  rotate.setAttributeNS(null, "attributeType", "XML");
  rotate.setAttributeNS(null, "fill", "freeze");
  rotate.setAttributeNS(null, "type", "rotate");
/*  rotate.setAttributeNS(null, "from", dir1 + ", "+(x1+offset)+", "+(y1+offset));
  rotate.setAttributeNS(null, "to", dir2 + ", "+(x2+offset)+", "+(y2+offset));*/
  rotate.setAttributeNS(null, "from", dir1 + ", "+(offset)+", "+(offset));
  rotate.setAttributeNS(null, "to", dir2 + ", "+(offset)+", "+(offset));
/*  rotate.setAttributeNS(null, "from", dir1 + ", 0,0");
  rotate.setAttributeNS(null, "to", dir2 + ", 0,0");*/
  rotate.setAttributeNS(null, "begin", "indefinite");
  rotate.setAttributeNS(null, "dur", "1s");
  tri.appendChild(rotate);
  tri.setAttributeNS(null, "transform", "rotate("+dir1 + ", "+(offset)+", "+(offset)+")");

  tri.setAttributeNS(null, "transform", "translate("+x1+ ", "+y1+")");
  
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
  document.rootElement.appendChild(createNale(2,2,"up"));
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
