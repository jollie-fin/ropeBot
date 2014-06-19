//http://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function
function defaultFor(arg, val)
{ return typeof arg !== 'undefined' ? arg : val; }

//http://stackoverflow.com/questions/10270711/copy-associative-array-in-javascript
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}

function newPt(x, y)
{
  return {"x" : x, "y" : y};
}

function createSVGobject(type, attribute, namespace)
{
  namespace = defaultFor(namespace, null);
  newSVGobject = document.createElementNS(svgns, type);
  for (var key in attribute)
  {
    newSVGobject.setAttributeNS(namespace, key, attribute[key]);
  }
  return newSVGobject;
}

function computeCoord(pt)
{
  var deltax = Math.cos(1./6.*Math.PI);
  var deltay = .75;
  var offset;
  if (pt.y % 2 == 0)
    offset = deltax / 2.;
  else
    offset = 0;

  return {"x" : (deltax*pt.x+offset+deltax/2.),
          "y" : (deltay*pt.y+1./2.)};
}


function transformfromprogram(start, p,width)
{
  var repetition = new Array();  

  var curPt = newPt(start["x"], start["y"]);
  
  var d = start["d"];

  var dir = 1;
  if (d in data.map.direction)
    dir = data.map.direction[d];
  var dirIce = 1;
  var onIce = false;
  var coeffIce = 1;
  var dirAngle = 60. * dir;

  var rotate = "";
  var trans = "";
  var rotateInit = "";
  var transInit = "";
  
  var keys = new Array();
  var pcs = new Array();
  var iteration = 0;
  var pc = 0;

  var computeNextPt = function(oldPt, coeff, dir)
  {
    if (coeff < 0)
    {
      dir += 3;
      if (dir >= 6)
        dir -= 6;
      coeff = -coeff;
    }
     
    var delta = [[[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]],
                 [[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]]];
    var parity = oldPt.y % 2;
    return {"x" : oldPt.x + delta[parity][dir][0], "y" : oldPt.y + delta[parity][dir][1]};
  }
  
  var cost = function()
  {
    var i;
    var ret = 0;
    for (i = 0; i < p.length; i++)
    {
      base = p[i][0];
      if (p[i][0][0] != "F" && p[i][0][0] != "B")
        base = p[i][0][0];

      if (base in data.level.cost)
        ret += data.level.cost[base];
      if (p[i][1] != -1)
        ret += data.level.cost["limit"];
      if (p[i][2] != "")
        ret += data.level.cost["color"];
      if (p[i][3] != "")
        ret += data.level.cost["symbol"];
    }
    return ret;
  }

  var iterate = function(pt,dirAngle,time)
  {
    rotate += ";" + dirAngle + "," + 0 + "," + 0;
    coord = computeCoord(pt);
    trans += ";" + coord.x + "," + coord.y;
    pcs[iteration] = pc;
    keys[iteration+1] = keys[iteration] + time;
    iteration++;
  }

  var groundAt = function(pt)
  {
    var color = data.level.background[pt.y][pt.x];
    var symbol = data.level.symb[pt.y][pt.x];
    var ground = "";
    if (color in data.level.ground)
      ground = data.level.ground[color];
    if (symbol in data.level.ground)
      ground = data.level.ground[symbol];
    if (ground in data.map.ground)
      return data.map.ground[ground];
    else
      return "";
  }
  
  var isOutside = function(pt)
  {
    return pt.x < 0 || pt.x >= 10 || pt.y < 0 || pt.y >= 12;
  }

  var isInside = function(pt)
  {
    return !isOutside(pt);
  }
  
  for (var i = 0; i < p.length; i++)
    repetition[i] = 0;

  {
    var coord = computeCoord(curPt);
  
    rotateInit = "rotate(" + dirAngle + "," + 0 + "," + 0 + ")";
    transInit = "translate(" + coord.x + "," + coord.y+ ")";

    rotate = " " + dirAngle + "," + 0 + "," + 0;
    trans = " " + coord.x + "," + coord.y;
  }
  
  keys[iteration] = 0.;
  var stop = false;

  while (pc < p.length && iteration < 1000 && !stop)
  {
    var accept = true;
    
    var color = data.level.background[curPt.y][curPt.x];
    var symbol = data.level.symb[curPt.y][curPt.x];

    accept = accept && (   p[pc][1] == -1
                        || repetition[pc] < p[pc][1]);
    accept = accept && (   p[pc][2] == ""
                        || (   (p[pc][2][0] == "!" || color == p[pc][2])
                            && (p[pc][2][0] != "!" || color != p[pc][2].substring(1,p[pc][2].length))));
    accept = accept && (   p[pc][3] == ""
                        || (   (p[pc][3][0] == "!" || symbol == p[pc][3])
                            && (p[pc][3][0] != "!" || color != p[pc][3].substring(1,p[pc][3].length))));

    if (accept)
    {
      repetition[pc]++;
      switch (p[pc][0][0])
      {
        case "L":
        case "R":
          var coeff = (p[pc][0][0] == "R") ? 1 : -1;
          dir+=coeff;
          if (dir == 6)
            dir = 0;
          if (dir == -1)
            dir = 5;
          dirAngle += coeff*60.;

          var nextPt = computeNextPt(curPt, coeffIce, dirIce);
          var ground = groundAt(curPt);
          var nextGround = groundAt(nextPt);

          if (ground != "ice")
            onIce = false;

          if (onIce)
          {
            if (isOutside(nextPt))
            {
              iterate(curPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            else if (nextGround == "lava")
            {
              iterate(nextPt,dirAngle,1.);
              iterate(nextPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            else if (nextGround != "wall")
            {
              curPt = nextPt;
            }
            iterate(curPt,dirAngle,1.);
          }
          else
          {
            iterate(curPt,dirAngle,1.);
          }

          pc++;
          break;

        case "F":
        case "B":
          var coeff = (p[pc][0][0] == "F") ? 1 : -1;
          var nb = parseInt(p[pc][0].substring(1,p[pc][0].length));

          for (i = 0; i < nb; i++)
          {
            var nextPt = computeNextPt(curPt, coeff, dir);

            if (isOutside(nextPt))
            {
              iterate(curPt,dirAngle+720.,2.);
              stop = true;
              break;
            }

            var ground = groundAt(curPt);
            var nextGround = groundAt(nextPt);

            if (nextGround == "wall")
            {
                iterate(curPt,dirAngle,1.);
                i = nb-1;
                break;
            }
            if (ground == "sand")
            {
              onIce = false;
              if (i < nb-1)
              {
                i++;
                curPt = nextPt;
                iterate(curPt,dirAngle,2.);
              }
              else
              {
                iterate(curPt,dirAngle,1.);
                break;
              }
            }
            else if (nextGround == "ice" || ground == "ice")
            {
              dirIce = dir;
              coeffIce = coeff;
              onIce = true;
              curPt = nextPt;
              iterate(curPt,dirAngle,1.);
            }
            else
            {
              onIce = false;
              curPt = nextPt;
              iterate(curPt,dirAngle,1.);
            }

            if (nextGround == "lava")
            {
              iterate(curPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            if (nextGround == "space")
            {
                var nextNextPt = nextPt;

                var nbcases = -1;
                while (isInside(nextNextPt) && groundAt(nextPt) == "space")
                {
                  nextPt = nextNextPt;
                  nextNextPt = computeNextPt(nextNextPt, coeff, dir);
                  nbcases++;
                }
                curPt = nextPt;

                dirAngle += 360.*nbcases;
                iterate(curPt,dirAngle,nbcases);
                if (isOutside(nextNextPt))
                {
                  iterate(curPt,dirAngle+720.,2.);
                  stop = true;
                  break;
                }
            }
          }
          if (stop)
            break;

          pc++;
          break;

        case "G":
          var label = p[pc][0].substring(1,p[pc][0].length);
          var i = 0;
          while (i < p.length && p[i][0] != label)
            i++;

          var nextPt = computeNextPt(curPt, coeffIce, dirIce);
          var ground = groundAt(curPt);
          var nextGround = groundAt(nextPt);

          if (ground != "ice")
            onIce = false;

          if (onIce)
          {
            if (isOutside(nextPt))
            {
              iterate(curPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            else if (nextGround == "lava")
            {
              iterate(nextPt,dirAngle,1.);
              iterate(nextPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            else if (nextGround != "wall")
            {
              curPt = nextPt;
            }
            iterate(curPt,dirAngle,1.);
          }
          else
          {
            iterate(curPt,dirAngle,.4);
          }
          pc = i;
          break;

        case "N":
          var newx = computeNextPt(curPt, coeffIce, dirIce);
          var ground = groundAt(curPt);
          var nextGround = groundAt(nextPt);

          if (ground != "ice")
            onIce = false;

          if (onIce)
          {
            if (isOutside(nextPt))
            {
              iterate(curPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            else if (nextGround == "lava")
            {
              iterate(nextPt,dirAngle,1.);
              iterate(nextPt,dirAngle+720.,2.);
              stop = true;
              break;
            }
            else if (nextGround != "wall")
            {
              curPt = nextPt;
            }
            iterate(curPt,dirAngle,1.);
          }

          pc++;
          break;

        default:
          iterate(curPt,dirAngle,.4);
          pc++;
          break;
      }
    }
    else
    {
      pc++;
    }
  }
  pcs[iteration] = pc;

  var keysstring = "0";

  var duration = keys[keys.length - 1];

  for (var i = 1; i < keys.length; i++)
  {
    keysstring += "; " + (keys[i] / duration);
  }


  var pctrans = "0,0";
  for (var i = 1; i < pcs.length; i++)
  {
    pctrans += "; 0," + pcs[i]*.5;
  }
  var pctransInit = "translate(0,0)";
  var valcost = cost();

  return {"translate" : trans, "rotate" : rotate, "translateinit" : transInit, "rotateInit" : rotateInit, "duration" : duration, "keys" : keysstring, "pc" : pcs, "pctrans" : pctrans, "pctransInit" : pctransInit, "cost" : valcost};
}


function createSymbole(s)
{
  switch (s)
  {
    case "circle":
      var newSVGobject =
        createSVGobject("circle",
                         {"cx": 0.,
                          "cy": 0.,
                          "r" : .45});
      return newSVGobject;

    case "square":
      var radius = .5;
      var points = "";

      for (var i=0; i<4; i++)
      {
        var dx = radius*Math.cos(Math.PI*(.5*i+.25));
        var dy = radius*Math.sin(Math.PI*(.5*i+.25));
        points = points + dx + "," + dy + " ";
      }

      var newSVGobject =
        createSVGobject("polygon",
                         {"points":points});

      return newSVGobject;

// triangle
    case "triangle":
      var radius = .5;
      var points = "";

      for (var i=0; i<3; i++)
      {
        var dx = radius*Math.cos(Math.PI*(-.5+2./3.*i));
        var dy = radius*Math.sin(Math.PI*(-.5+2./3.*i));
        points = points + dx + "," + dy + " ";
      }

      var newSVGobject =
        createSVGobject("polygon",
                         {"points":points});
      return newSVGobject;

//star
    case "star":
      var radius = .5;
      var innerradius = .2;
      var points = "";

      for (var i=0; i<5; i++)
      {
        var dx = radius*Math.cos(Math.PI*(-.5+.4*i));
        var dy = radius*Math.sin(Math.PI*(-.5+.4*i));
        points = points + dx + "," + dy + " ";
        dx = innerradius*Math.cos(Math.PI*(-.3+.4*i));
        dy = innerradius*Math.sin(Math.PI*(-.3+.4*i));
        points = points + dx + "," + dy + " ";

      }

      var newSVGobject =
        createSVGobject("polygon",
                         {"points":points});
      return newSVGobject;

    default:
      return undefined;
  }
}

function coordNale()
{
  var points = "";
  var radius = .25;
  
  for (var i=-1; i<2; i++)
  {
    dx = radius*Math.cos(Math.PI*(4./5.*i));
    dy = radius*Math.sin(Math.PI*(4./5.*i));//-radius*0.4;
    points = points + dx + "," + dy + " ";
  }
  return points;
}


function createSimulation(start, p)
{
  var points = coordNale();
  t = transformfromprogram(start,p);

  var nale =
    createSVGobject("polygon",
                     {"points":points,
                      "id"    :"nale",
                      "style" : "fill: orange;stroke:black;stroke-width:0.02px;",
                      "transform": t["rotateInit"]});


  duration = t["duration"] * 0.5;
  duration = " " + duration + "s";

  var trans =
    createSVGobject("animateTransform",
                     {"id": "naleanimationtranslation",
                      "attributeName": "transform",
                      "attributeType": "XML",
                      "type": "translate",
                      "fill": "freeze",
                      "values": t["translate"],
                      "keyTimes": t["keys"],
                      "begin": "pcanimationtranslation.begin",
                      "dur": duration});

  var rotate =
    createSVGobject("animateTransform",
                     {"id": "naleanimationrotation",
                      "attributeName": "transform",
                      "attributeType": "XML",
                      "fill": "freeze",
                      "type": "rotate",
                      "values": t["rotate"],
                      "keyTimes": t["keys"],
                      "begin": "pcanimationtranslation.begin",
                      "dur": duration});

  nale.appendChild(rotate);

  var groupnale =
    createSVGobject("g",
                     {"id" : "nale",
                      "transform": t["translateinit"]});

  groupnale.appendChild(nale);
  groupnale.appendChild(trans);

  var pc =
    createSVGobject ("rect",
                      {"x": 0,
                       "y": .125,
                       "id": "pcindicator",
                       "width": .25,
                       "height": .25,
                       "style": "fill: green;stroke:black;stroke-width:0.02px;",
                       "transform": t["pctransInit"]});

  var pctrans = 
    createSVGobject("animateTransform",
                     {"id": "pcanimationtranslation",
                      "attributeName": "transform",
                      "attributeType": "XML",
                      "type": "translate",
                      "fill": "freeze",
                      "values": t["pctrans"],
                      "keyTimes": t["keys"],
                      "begin": "indefinite",
                      "calcMode": "discrete",
                      "dur": duration
                      });


  pc.appendChild(pctrans);
  var grouppc =
    createSVGobject("g",
                     {"id" : "pc"});

  grouppc.appendChild(pc);

  for (var i = 0; i < p.length; i++)
  {
    var text = 
      createSVGobject("text",
                       {"x": .5 * .65,
                        "y": .5 * (.95+i),
                        "font-size": (.5 * .9)+"px"});
    text.textContent = p[i][0];
    grouppc.appendChild(text);
  }

  var textcost = 
    createSVGobject("text",
                     {"id" : "totalcost",
                      "x": .5 * .1,
                      "y": 0.,
                      "font-size": (.5*.9)+"px"});
  textcost.textContent = t["cost"];

  simulation = {"map" : groupnale, "exec" : grouppc, "cost" : textcost};
  return simulation;
}

function createMap(height)
{
  var SVGbackgroundtile =
    createSVGobject("g",
                     {"id" : "backgroundtile"});

  var SVGbackgroundsymb =
    createSVGobject("g",
                     {"id" : "backgroundsymb"});


  for (var i=0; i<12; i++)
  {
    for (var j=0; j<10; j++)
    {
      var color = data.map.colordefault;
      if (data.level.background[i][j] in data.map.color)
        color = data.map.color[data.level.background[i][j]];


      var points = "";
      for (var k = 0; k < 6; k++)
      {
        var dx = 1./2. * Math.cos(Math.PI*(0.5+k*2./6.));
        var dy = 1./2. * Math.sin(Math.PI*(0.5+k*2./6.));
        points += dx + "," + dy + " ";
      }
      var coord = computeCoord(newPt(j, i));

      var tile =
        createSVGobject("polygon",
                         {"points":points,
                          "transform": "translate("+coord.x+","+coord.y+")",
                          "style" : "fill:"+color+";stroke:black;stroke-width:0.02px;"});


      SVGbackgroundtile.appendChild(tile);
      
      
      color = data.map.symbcolordefault;
      var bngcolor = data.map.symbbngcolordefault;
      if (data.level.background[i][j] in data.map.symbcolor)
        color = data.map.symbcolor[data.level.background[i][j]];
      if (data.level.background[i][j] in data.map.symbbngcolor)
        bngcolor = data.map.symbbngcolor[data.level.background[i][j]];
        
      if (data.level.symb[i][j] in data.map.symb)
      {
        var symbole = createSymbole(data.map.symb[data.level.symb[i][j]]);
        if (symbole !== undefined)
        {
          var sizebng = 0.6;

          symbole.setAttributeNS(null, "transform", "translate("+coord.x+","+coord.y+") scale(+"+sizebng+")");
          symbole.setAttributeNS(null, "style", "fill:"+color+";stroke:"+bngcolor+";stroke-width:0.05px;");
          SVGbackgroundsymb.appendChild(symbole);          
        }
      }

    }
  }

  var SVGmap =
    createSVGobject("g",
                     {"id" : "map",
                     "transform" : "scale("+height+")"});


  simulation = createSimulation(data.program.start,data.program.content);

  var SVGexec =
    createSVGobject("g",
                     {"id" : "execution"});

  SVGmap.appendChild(SVGbackgroundtile);
  SVGmap.appendChild(SVGbackgroundsymb);
  SVGmap.appendChild(simulation["map"]);

  coordexec = computeCoord(newPt(10,0));
  simulation["exec"].setAttributeNS(null, "transform", "translate("+coordexec.x+", "+coordexec.y+")");

  SVGmap.appendChild(simulation["exec"]);

  var SVGcost =
    createSVGobject("g",
                     {"id" : "cost"});
  simulation["cost"].setAttributeNS(null, "transform", "translate("+coordexec.x+", "+coordexec.y+")");
  SVGmap.appendChild(simulation["cost"]);

  document.rootElement.appendChild(SVGmap);

}

function move()
{
  document.getElementById("pcanimationtranslation").beginElement();
}

function init()
{
  createMap(50.);  
  document.rootElement.addEventListener("click", move, false);
}

