var map = [
["white", "red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white"],
["white", "red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white"],
["white", "red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white"],
["white", "red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white"],
["red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white"],
["red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white"],
["red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white"],
["red", "red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white"],
["red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white", "red"],
["red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white", "red"],
["red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white", "red"],
["red", "white", "white", "red", "red", "white", "white", "red", "red", "white", "white", "red"]];

document.rootElement.addEventListener('SVGLoad', createMap, false);

function createMap()
{
  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      tile = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      tile.setAttributeNS(null, 'x', 40*i);
      tile.setAttributeNS(null, 'y', 40*j);
      tile.setAttributeNS(null, 'width', 40);
      tile.setAttributeNS(null, 'height', 40);
      tile.setAttributeNS(null, 'style', "fill:"+map[i][j]+";stroke:black;stroke-width:1px;");
      document.rootElement.appendChild(tile);
    }
  }
}

