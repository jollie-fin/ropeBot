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
  var stop = false;
  while (pc < p.length && iteration < 1000 && !stop)
  {
    var denysymbol = false;
    var denycolor = false;
    var accept = (p[pc][1] == -1);
    
    var color = background[y][x];
    var symbol = symb[y][x];

    if (p[pc][2] != "" && p[pc][2][0] != "!" && color != p[pc][2])
      denycolor = true;

    if (p[pc][2] != "" && p[pc][2][0] == "!" && color == p[pc][2].substring(1,p[pc][2].length))
      denycolor = true;

    if (p[pc][3] != "" && p[pc][3][0] != "!" && symbol != p[pc][3])
      denysymbol = true;

    if (p[pc][3] != "" && p[pc][3][0] == "!" && symbol == p[pc][3].substring(1,p[pc][3].length))
      denysymbol = true;

    if (repetition[pc] < p[pc][1])
      accept = true;

    if (accept && !denysymbol && !denycolor)
    {
      repetition[pc]++;
      switch (p[pc][0][0])
      {
        case "L":
        case "R":
          var coeff = (p[pc][0][0] == "R") ? 1 : -1;
          dir+=coeff;
          if (dir == 4)
            dir = 0;
          if (dir == -1)
            dir = 3;
          dirangle += coeff*90;
          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          pcs[iteration] = pc;
          keys[iteration+1] = keys[iteration] + 1.;
          pc++;
          break;

        case "F":
        case "B":
          var coeff = (p[pc][0][0] == "F") ? 1 : -1;
          var nb = parseInt(p[pc][0][1]);
          var newx = x+coeff*nb*delta[dir][0];
          var newy = y+coeff*nb*delta[dir][1];
          if (newx < 0 || newx >= 12 || newy < 0 || newy >= 12)
          {
            stop = true;
            break;
          }
          var ground = "";
          var newcolor = background[newy][newx];
          var newsymbol = symb[newy][newx];
          if (newcolor in groundlevel)
            ground = groundlevel[newcolor];
          if (newsymbol in groundlevel)
            ground = groundlevel[newsymbol];
          if (ground in mapground)
          {
            ground = mapground[ground];
            if (ground == "wall")
            {
            }
            else if (ground == "lava")
            {
              stop = true;
              break;
            }
            else
            {
              x = newx;
              y = newy;
            }
          }
          else
          {
            x = newx;
            y = newy;
          }

          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          pcs[iteration] = pc;
          keys[iteration+1] = keys[iteration] + 1.;
          pc++;
          break;

        case "G":
          var label = p[pc][0].substring(1,p[pc][0].length);
          var i = 0;
          while (i < p.length && p[i][0] != label)
            i++;

          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + .4;
          pcs[iteration] = pc;
          pc = i;
          break;

        default:
          rotate += ";" + dirangle + "," + offset + "," + offset;
          trans += ";" + (width*x) + "," + (width*y);
          keys[iteration+1] = keys[iteration] + .4;
          pcs[iteration] = pc;
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
  if (pc != p.length)
    pcs[iteration-1] = pc;
  else
    pcs[iteration] = pc;

  var keysstring = "0.";

  var duration = keys[keys.length - 1];

  for (var i = 1; i < keys.length; i++)
  {
    keysstring += "; " + (keys[i] / duration);
  }


  var pctrans = "0,0";
  for (var i = 1; i < pcs.length; i++)
  {
    pctrans += "; 0," + pcs[i]*width/2.;
  }
  var pctransinit = "translate(0,0)";

  return {"translate" : trans, "rotate" : rotate, "translateinit" : transinit, "rotateinit" : rotateinit, "duration" : duration, "keys" : keysstring, "pc" : pcs, "pctrans" : pctrans, "pctransinit" : pctransinit};
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

  var nale = document.createElementNS(svgns, "polygon");
  var points = coordNale();


  nale.setAttributeNS(null, "points", points);
  nale.setAttributeNS(null, "id", "nale");

  nale.setAttributeNS(null, "style", "fill: orange;stroke:black;stroke-width:1px;");

  var group = document.createElementNS(svgns, "g");
  var groupnale = document.createElementNS(svgns, "g");

  t = transformfromprogram(start,p);

  duration = t["duration"] * .25;
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

  nale.appendChild(rotate);
  nale.setAttributeNS(null, "transform", t["rotateinit"]);

  groupnale.setAttributeNS(null, "transform", t["translateinit"]);
  groupnale.appendChild(nale);
  groupnale.appendChild(trans);
  group.appendChild(groupnale);

  var pc = document.createElementNS(svgns, "rect");
  pc.setAttributeNS(null, "x", "480");
  pc.setAttributeNS(null, "y", "5");
  pc.setAttributeNS(null, "width", "10");
  pc.setAttributeNS(null, "height", "10");
  pc.setAttributeNS(null, "style", "fill: green;stroke:black;stroke-width:1px;");
  pc.setAttributeNS(null, "transform", t["pctransinit"]);

  var pctrans = document.createElementNS(svgns, "animateTransform");
  pctrans.setAttributeNS(null, "id", "nalepc");
  pctrans.setAttributeNS(null, "attributeName", "transform");
  pctrans.setAttributeNS(null, "attributeType", "XML");
  pctrans.setAttributeNS(null, "type", "translate");
  pctrans.setAttributeNS(null, "fill", "freeze");
  pctrans.setAttributeNS(null, "values", t["pctrans"]);
  pctrans.setAttributeNS(null, "keyTimes", t["keys"]);
  pctrans.setAttributeNS(null, "begin", "indefinite");
  pctrans.setAttributeNS(null, "dur", duration);
  pctrans.setAttributeNS(null, "calcMode", "discrete");

  pc.appendChild(pctrans);

  group.appendChild(pc);
  for (var i = 0; i < p.length; i++)
  {
    var text = document.createElementNS(svgns, "text");
    text.setAttribute("x", "493");
    text.setAttribute("y", "" + (19+i*20));
    text.setAttribute("font-size", "18px");
    text.textContent = p[i][0];
    group.appendChild(text);
  }
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
  document.getElementById("nalepc").beginElement();

nalepc
}

function init()
{
  createMap();  
  document.rootElement.addEventListener("click", move, false);
}
