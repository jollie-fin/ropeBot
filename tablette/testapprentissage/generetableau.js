document.rootElement.addEventListener("SVGLoad", createMap, false);

function symbolecircle(x,y,width,color)
{
  circle = document.createElementNS(svgns, "circle");
  circle.setAttributeNS(null, "cx", x+width/2);
  circle.setAttributeNS(null, "cy", y+width/2);
  circle.setAttributeNS(null, "r", width/3);
  circle.setAttributeNS(null, "style", "fill:"+color);
  return circle;
}


function createMap()
{
  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      tile = document.createElementNS(svgns, "rect");
      tile.setAttributeNS(null, "x", 40*i);
      tile.setAttributeNS(null, "y", 40*j);
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

      switch(symb[i][j])
      {
        case "C":
          circle = symbolecircle(40*i,40*j,40, color);
          document.rootElement.appendChild(circle);
          break;
      }
    }
  }
}

