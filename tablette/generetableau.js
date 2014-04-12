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

function transformfromstring(x, y, d, s)
{
  var delta=[[0,-1],[1,0],[0,1],[-1,0]];
  var dir = 0;
  if (d in mapdirection)
  dir = mapdirection[d];

  var dirangle = 90 * dir;
  var width = 40.;
  var offset = width / 2.;

  var rotate = "";
  var trans = "";
  var duration = 0;

  var x = x;
  var y = y;
  rotateinit = "rotate(" + dirangle + "," + offset + "," + offset + ")";
  transinit = "translate(" + (width*x) + "," + (width*y)+ ")";

  rotate = " " + dirangle + "," + offset + "," + offset;
  trans = " " + (width*x) + "," + (width*y);

  for (var i = 0; i < s.length; i++)
  {
    switch (s[i])
    {
      case "A":
        x += delta[dir][0];
        y += delta[dir][1];
        rotate += ";" + dirangle + "," + offset + "," + offset;
        trans += ";" + (width*x) + "," + (width*y);
        duration++;
        break;

      case "R":
        x -= delta[dir][0];
        y -= delta[dir][1];
        rotate += ";" + dirangle + "," + offset + "," + offset;
        trans += ";" + (width*x) + "," + (width*y);
        duration++;
        break;

      case "D":
        dir++;
        if (dir == 4)
          dir = 0;
        dirangle += 90;
        rotate += ";" + dirangle + "," + offset + "," + offset;
        trans += ";" + (width*x) + "," + (width*y);
        duration++;
        break;
        
      case "G":
        dir--;
        if (dir == -1)
          dir = 3;
        dirangle -= 90;
        rotate += ";" + dirangle + "," + offset + "," + offset;
        trans += ";" + (width*x) + "," + (width*y);
        duration++;
        break;
    }
  }
  return {"translate" : trans, "rotate" : rotate, "translateinit" : transinit, "rotateinit" : rotateinit, "duration" : duration};
}

function createNale(x, y, d, s)
{
  var tri = document.createElementNS(svgns, "polygon");
  var points = coordNale();


  tri.setAttributeNS(null, "points", points);
  tri.setAttributeNS(null, "id", "nale");

  tri.setAttributeNS(null, "style", "fill: orange;stroke:black;stroke-width:1px;");

  var group = document.createElementNS(svgns, "g");

  t = transformfromstring(x,y,d,s);

  duration = t["duration"] * 1;
  duration = " " + duration + "s";
  var trans = document.createElementNS(svgns, "animateTransform");
  trans.setAttributeNS(null, "id", "naletranslation");
  trans.setAttributeNS(null, "attributeName", "transform");
  trans.setAttributeNS(null, "attributeType", "XML");
  trans.setAttributeNS(null, "type", "translate");
  trans.setAttributeNS(null, "fill", "freeze");
  trans.setAttributeNS(null, "values", t["translate"]);
  trans.setAttributeNS(null, "begin", "indefinite");
  trans.setAttributeNS(null, "dur", duration);

  
  var rotate = document.createElementNS(svgns, "animateTransform");
  rotate.setAttributeNS(null, "id", "nalerotation");
  rotate.setAttributeNS(null, "attributeName", "transform");
  rotate.setAttributeNS(null, "attributeType", "XML");
  rotate.setAttributeNS(null, "fill", "freeze");
  rotate.setAttributeNS(null, "type", "rotate");
  rotate.setAttributeNS(null, "values", t["rotate"]);
  rotate.setAttributeNS(null, "begin", "indefinite");
  rotate.setAttributeNS(null, "dur", duration);
  tri.appendChild(rotate);
  tri.setAttributeNS(null, "transform", t["rotateinit"]);

  tri.setAttributeNS(null, "transform", t["translateinit"]);
  
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
  document.rootElement.appendChild(createNale(2,2,"up","AAGRGAADA"));
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
