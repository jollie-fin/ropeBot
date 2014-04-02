document.rootElement.addEventListener("SVGLoad", createMap, false);

function createSymbole(x,y,width,s)
{
  x = x*width;
  y = y*width;
  switch (s)
  {
    case "circle":
      circle = document.createElementNS(svgns, "circle");
      circle.setAttributeNS(null, "cx", x+width/2.);
      circle.setAttributeNS(null, "cy", y+width/2.);
      circle.setAttributeNS(null, "r", width/3.);
      return circle;
    case "square":
      rect = document.createElementNS(svgns, "rect");
      rect.setAttributeNS(null, "x", x+width/6.);
      rect.setAttributeNS(null, "y", y+width/6.);
      rect.setAttributeNS(null, "width", width*2./3.);
      rect.setAttributeNS(null, "height", width*2./3.);
      return rect;
// triangle
    case "triangle":
      radius = width * .4;
      tri = document.createElementNS(svgns, "polygon");
      points = "";

      for (var i=0; i<3; i++)
      {
        dx = x+width/2.+radius*Math.cos(Math.PI*(-1./2.+2./3.*i));
        dy = y+width/2.+radius*0.2+radius*Math.sin(Math.PI*(-1./2.+2./3.*i));
        points = points + dx + "," + dy + " ";
      }

      tri.setAttributeNS(null, "points", points);
      return tri;
//star
    case "star":
      radius = width * .4;
      tri = document.createElementNS(svgns, "polygon");
      points = "";

      for (var i=0; i<5; i++)
      {
        dx = x+width/2.+radius*Math.cos(Math.PI*(-1./2.+4./5.*i));
        dy = y+width/2.+radius*Math.sin(Math.PI*(-1./2.+4./5.*i));
        points = points + dx + "," + dy + " ";
      }

      tri.setAttributeNS(null, "points", points);
      return tri;
    default:
      return undefined;
  }
}

function createMap()
{
  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      tile = document.createElementNS(svgns, "rect");
      tile.setAttributeNS(null, "x", 40*j);
      tile.setAttributeNS(null, "y", 40*i);
      tile.setAttributeNS(null, "width", 40);
      tile.setAttributeNS(null, "height", 40);
      color = mapcolordefault;
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
      color = mapsymbcolordefault;
      if (background[i][j] in mapsymbcolor)
        color = mapsymbcolor[background[i][j]];

      if (symb[i][j] in mapsymb)
      {
        symbole = createSymbole(j,i,40,mapsymb[symb[i][j]]);
        if (symbole !== undefined)
        {
          symbole.setAttributeNS(null, "style", "fill:"+color);
          document.rootElement.appendChild(symbole);
        }
      }
    }
  }
}

