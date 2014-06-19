//http://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function
function defaultFor(arg, val)
{ return typeof arg !== 'undefined' ? arg : val; }


/*Create a new point*/
function newPt(x, y)
{
  return {"x" : x, "y" : y};
}

/*Create a new SVGobject, with attributes already set*/
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

/*compute the physical coordinates of a point in the hexagonal system*/
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

/*take a program and execute it. Return the translation and rotation animation of Nale, and the evolution of the Program Counter*/
function transformFromProgram(start, p)
{
  /*how many times each instruction is executed. Used for count restriction */
  var repetition = new Array();  

  /*coordinates of Nale*/
  var curPt = newPt(start["x"], start["y"]);
  
  /*direction of Nale;
  realdirection = dir*PI/3*/
  
  var d = start["d"];
  var dir = 1;
  if (d in data.map.direction)
    dir = data.map.direction[d];

  /*variables used when Nale is on ice*/
  /*direction of Nale*/
  var dirIce = dir;
  /*isNale on ice*/
  var onIce = false;
  
  /*rotation animation*/
  var rotateInit = "";
  var rotate = "";
  /*translation animation*/
  var trans = "";
  var transInit = "";

  /*sequence of value of the Program Counter*/  
  var pcs = new Array();
  
  /*time key used to vary animation speed*/
  var keys = new Array();
  
  /*how many instruction have been executed*/
  var iteration = 0;
  
  /*program counter*/
  var pc = 0;

  /*compute the next coordinate of nale depending of the moving direction*/
  var computeNextPt = function(oldPt, dir)
  {
    if (dir < 0)
      dir += (-dir) * 6;
    dir %= 6;
     
    var delta = [[[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]],
                 [[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]]];
    var parity = oldPt.y % 2;
    return {"x" : oldPt.x + delta[parity][dir][0], "y" : oldPt.y + delta[parity][dir][1]};
  }
  
  /*compute the total cost for the player*/
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

  /*add a step in the animation*/
  var iterate = function(pt,dir,time)
  {
    rotate += ";" + (dir * 60.) + "," + 0 + "," + 0;
    coord = computeCoord(pt);
    trans += ";" + coord.x + "," + coord.y;
    pcs[iteration] = pc;
    keys[iteration+1] = keys[iteration] + time;
    iteration++;
  }

  /*return the status of the ground under Nale*/
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
  
  /*iterate one step when Nale is on ice*/
  var slidingOnIce = function()
  {
    /*next position while sliding*/
    var nextPt = computeNextPt(curPt, dirIce);
    var nextGround = groundAt(nextPt);
    /*end of the board*/
    if (isOutside(nextPt))
    {
      iterate(curPt,dir+12,2.);
      stop = true;
    }
    /*lava*/
    else if (nextGround == "lava")
    {
      iterate(nextPt,dir,1.);
      iterate(nextPt,dir+12,2.);
      stop = true;
    }
    /*a wall stopped Nale*/
    else if (nextGround != "wall")
    {
      curPt = nextPt;
      iterate(curPt,dir,1.);
    }
  }
            
  /*initialise repetition*/
  for (var i = 0; i < p.length; i++)
    repetition[i] = 0;

  /*initialise the various animations*/
  {
    var coord = computeCoord(curPt);
  
    rotateInit = "rotate(" + (dir * 60.) + "," + 0 + "," + 0 + ")";
    transInit = "translate(" + coord.x + "," + coord.y+ ")";

    rotate = " " + (dir * 60.) + "," + 0 + "," + 0;
    trans = " " + coord.x + "," + coord.y;
  }
  
  keys[iteration] = 0.;
  
  var stop = false;

  /*to avoid infinite loop, Nale cannot execute more than 1000 instructions*/
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

    /*should the instruction be executed ?*/
    if (accept)
    {
      repetition[pc]++;
      
      /*switch depending on the instruction*/
      switch (p[pc][0][0])
      {
        /*turning left ot right*/
        case "L":
        case "R":
          dir += (p[pc][0][0] == "R") ? 1 : -1;

          var ground = groundAt(curPt);

          if (ground != "ice")
            onIce = false;

          if (onIce)
          {
            slidingOnIce();
          }
          else
          {
            iterate(curPt,dir,1.);
          }
          if (!stop)
            pc++;

          break;

        /*forward or backward*/
        case "F":
        case "B":
          var isMovingBackward = p[pc][0][0] != "F";
          var nb = parseInt(p[pc][0].substring(1,p[pc][0].length));

          /*compute multiple movement step by step*/
          for (i = 0; i < nb; i++)
          {
            var nextPt = computeNextPt(curPt, dir + isMovingBackward * 3);

            /*end of the board*/
            if (isOutside(nextPt))
            {
              iterate(curPt,dir+12,2.);
              stop = true;
              break;
            }

            var ground = groundAt(curPt);
            var nextGround = groundAt(nextPt);

            /*Nale cannot move*/
            if (nextGround == "wall")
            {
                iterate(curPt,dir,1.);
                i = nb-1;
                break;
            }
            /*if Nale is on sand, it have to move two steps to move on step on sand*/
            if (ground == "sand")
            {
              onIce = false;
              if (i < nb-1)
              {
                i++;
                curPt = nextPt;
                iterate(curPt,dir,2.);
              }
              else
              {
                iterate(curPt,dir,1.);
                break;
              }
            }
            /*if Nale is on ice*/
            else if (nextGround == "ice" || ground == "ice")
            {
              dirIce = dir + isMovingBackward*3;

              onIce = true;
              curPt = nextPt;
              iterate(curPt,dir,1.);
            }
            else
            {
              onIce = false;
              curPt = nextPt;
              iterate(curPt,dir,1.);
            }

            /*if Nale fall in lava*/
            if (nextGround == "lava")
            {
              iterate(curPt,dir+12,2.);
              stop = true;
              break;
            }
            /*if Nale go to space*/
            if (nextGround == "space")
            {
                var nextNextPt = nextPt;
                
                /*how many tile Nale should move before touching ground*/
                var nbTiles = -1;
                while (isInside(nextNextPt) && groundAt(nextPt) == "space")
                {
                  nextPt = nextNextPt;
                  nextNextPt = computeNextPt(nextNextPt, coeff, dir);
                  nbTiles++;
                }
                curPt = nextPt;

                /*rotate Nale on itself*/
                dir += 6*nbTiles;
                iterate(curPt,dir,nbTiles);
                if (isOutside(nextNextPt))
                {
                  iterate(curPt,dir+12,2.);
                  stop = true;
                  break;
                }
            }
          }
          if (stop)
            break;

          pc++;
          break;

        /*goto*/
        case "G":
          var label = p[pc][0].substring(1,p[pc][0].length);
 
          /*search for the first corresponding label the dirty way*/
          var i = 0;
          while (i < p.length && p[i][0] != label)
            i++;

          var ground = groundAt(curPt);

          if (ground != "ice")
            onIce = false;

          if (onIce)
          {
            slidingOnIce();
          }
          else
          {
            iterate(curPt,dir,.4);
          }
          if (!stop)
            pc = i;
          break;

        /*nop instruction*/
        case "N":
          var ground = groundAt(curPt);

          if (ground != "ice")
            onIce = false;

          if (onIce)
          {
            slidingOnIce();
          }
          if (!stop)
            pc++;
          break;

        /*unknown instruction*/
        default:
          iterate(curPt,dir,.4);
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


  /*compute the total duration*/
  var duration = keys[keys.length - 1];
  
  /*compute the time keys*/
  var keysstring = "0";
  for (var i = 1; i < keys.length; i++)
  {
    keysstring += "; " + (keys[i] / duration);
  }

  /*compute the sequence of value of the Program Counter*/
  var pctrans = "0,0";
  for (var i = 1; i < pcs.length; i++)
  {
    pctrans += "; 0," + pcs[i]*.5;
  }
  var pctransInit = "translate(0,0)";
  
  /*compute total cost*/
  var valcost = cost();

  return {"translate" : trans, "rotate" : rotate, "translateinit" : transInit, "rotateInit" : rotateInit, "duration" : duration, "keys" : keysstring, "pc" : pcs, "pctrans" : pctrans, "pctransInit" : pctransInit, "cost" : valcost};
}

/*create a symbol to print on tile*/
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

/*draw Nale at 0,0*/
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

/*create svgobject based on a simulation of the program*/
function createSimulation(start, p)
{
  /*draw Nale*/
  var points = coordNale();
  
  /*simulate the program*/
  t = transformFromProgram(start,p);

  /*effective duration of the simulation*/
  duration = t["duration"] * 0.5;
  duration = " " + duration + "s";

  /*nale*/
  var nale =
    createSVGobject("polygon",
                     {"points":points,
                      "id"    :"nale",
                      "style" : "fill: orange;stroke:black;stroke-width:0.02px;",
                      "transform": t["rotateInit"]});

  /*rotation animation of nale*/
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

  /*combination of transformation animation*/                  
  var groupNale =
    createSVGobject("g",
                     {"id" : "nale",
                      "transform": t["translateinit"]});

  /*translation animation of nale*/
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

  groupNale.appendChild(nale);
  groupNale.appendChild(trans);

  /*animation of the Program Counter*/
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

  
  /*display of the instruction*/
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

  /*display of the cost of the program*/
  var textcost = 
    createSVGobject("text",
                     {"id" : "totalcost",
                      "x": .5 * .1,
                      "y": 0.,
                      "font-size": (.5*.9)+"px"});
  textcost.textContent = t["cost"];

  simulation = {"map" : groupNale, "exec" : grouppc, "cost" : textcost};
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
      /*drawing of tile*/
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
      
      /*drawing of symbol*/
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

  /*global object with scaling attribute*/
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

