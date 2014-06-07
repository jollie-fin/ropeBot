//http://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function
function defaultFor(arg, val)
{ return typeof arg !== 'undefined' ? arg : val; }

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

function transformfromprogram(start, p,width)
{
  var repetition = new Array();  

  var x = start["x"];
  var y = start["y"];
  var d = start["d"];

  var delta=[[0,-1],[1,0],[0,1],[-1,0]];
  var dir = 1;
  if (d in data.map.direction)
    dir = data.map.direction[d];
  var dirice = 1;
  var onice = false;
  var coeffice = 1;
  var dirangle = 90 * dir;

  var offset = width / 2.;

  var rotate = "";
  var trans = "";
  var keys = new Array();
  var pcs = new Array();
  var iteration = 0;
  var pc = 0;

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

  var iterate = function(x,y,dirangle,time)
  {
    rotate += ";" + dirangle + "," + offset + "," + offset;
    trans += ";" + (width*x) + "," + (width*y);
    pcs[iteration] = pc;
    keys[iteration+1] = keys[iteration] + time;
    iteration++;
  }

  var groundAt = function(x,y)
  {
    var color = data.level.background[y][x];
    var symbol = data.level.symb[y][x];
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
    var accept = true;
    
    var color = data.level.background[y][x];
    var symbol = data.level.symb[y][x];

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
          if (dir == 4)
            dir = 0;
          if (dir == -1)
            dir = 3;
          dirangle += coeff*90;

          var newx = x+coeffice*delta[dirice][0];
          var newy = y+coeffice*delta[dirice][1];
          var ground = groundAt(x,y);
          var newground = groundAt(newx,newy);

          if (ground != "ice")
            onice = false;

          if (onice)
          {
            if (newx < 0 || newx >= 12 || newy < 0 || newy >= 12)
            {
              iterate(x,y,dirangle+720.,2.);
              stop = true;
              break;
            }
            else if (newground == "lava")
            {
              iterate(newx,newy,dirangle,1.);
              iterate(newx,newy,dirangle+720.,2.);
              stop = true;
              break;
            }
            else if (newground != "wall")
            {
              x = newx;
              y = newy;
            }
            iterate(x,y,dirangle,1.);
          }
          else
          {
            iterate(x,y,dirangle,1.);
          }

          pc++;
          break;

        case "F":
        case "B":
          var coeff = (p[pc][0][0] == "F") ? 1 : -1;
          var nb = parseInt(p[pc][0].substring(1,p[pc][0].length));

          for (i = 0; i < nb; i++)
          {
            var newx = x+coeff*delta[dir][0];
            var newy = y+coeff*delta[dir][1];

            if (newx < 0 || newx >= 12 || newy < 0 || newy >= 12)
            {
              iterate(x,y,dirangle+720.,2.);
              stop = true;
              break;
            }

            var ground = groundAt(x,y);
            var newground = groundAt(newx,newy);

            if (newground == "wall")
            {
                iterate(x,y,dirangle,1.);
                i = nb-1;
                break;
            }
            if (ground == "sand")
            {
              onice = false;
              if (i < nb-1)
              {
                i++;
                x = newx;
                y = newy;
                iterate(x,y,dirangle,2.);
              }
              else
              {
                iterate(x,y,dirangle,1.);
                break;
              }
            }
            else if (newground == "ice" || ground == "ice")
            {
              dirice = dir;
              coeffice = coeff;
              onice = true;
              x = newx;
              y = newy;
              iterate(x,y,dirangle,1.);
            }
            else
            {
              onice = false;
              x = newx;
              y = newy;
              iterate(x,y,dirangle,1.);
            }

            if (newground == "lava")
            {
              iterate(x,y,dirangle+720.,2.);
              stop = true;
              break;
            }
            if (newground == "space")
            {
                var newnewx = newx;
                var newnewy = newy;
                var nbcases = -1;
                while (newnewx >= 0 && newnewx < 12 && newnewy >= 0 && newnewy < 12 && groundAt(newx,newy) == "space")
                {
                  newx = newnewx;
                  newy = newnewy;
                  newnewx = newx + coeff*delta[dir][0];
                  newnewy = newy + coeff*delta[dir][1];
                  nbcases++;
                }
                x = newx;
                y = newy;
                dirangle += 360.*nbcases;
                iterate(x,y,dirangle,nbcases);
                if (newnewx < 0 || newnewx >= 12 || newnewy < 0 || newnewy >= 12)
                {
                  iterate(x,y,dirangle+720.,2.);
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

          var newx = x+coeffice*delta[dirice][0];
          var newy = y+coeffice*delta[dirice][1];
          var ground = groundAt(x,y);
          var newground = groundAt(newx,newy);

          if (ground != "ice")
            onice = false;

          if (onice)
          {
            if (newx < 0 || newx >= 12 || newy < 0 || newy >= 12)
            {
              iterate(x,y,dirangle+720.,2.);
              stop = true;
              break;
            }
            else if (newground == "lava")
            {
              iterate(newx,newy,dirangle,1.);
              iterate(newx,newy,dirangle+720.,2.);
              stop = true;
              break;
            }
            else if (newground != "wall")
            {
              x = newx;
              y = newy;
            }
            iterate(x,y,dirangle,1.);
          }
          else
          {
            iterate(x,y,dirangle,.4);
          }
          pc = i;
          break;

        case "N":
          var newx = x+coeffice*delta[dirice][0];
          var newy = y+coeffice*delta[dirice][1];
          var ground = groundAt(x,y);
          var newground = groundAt(newx,newy);

          if (ground != "ice")
            onice = false;

          if (onice)
          {
            if (newx < 0 || newx >= 12 || newy < 0 || newy >= 12)
            {
              iterate(x,y,dirangle+720.,2.);
              stop = true;
              break;
            }
            else if (newground == "lava")
            {
              iterate(newx,newy,dirangle,1.);
              iterate(newx,newy,dirangle+720.,2.);
              stop = true;
              break;
            }
            else if (newground != "wall")
            {
              x = newx;
              y = newy;
            }
            iterate(x,y,dirangle,1.);
          }

          pc++;
          break;

        default:
          iterate(x,y,dirangle,.4);
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
  var valcost = cost();

  return {"translate" : trans, "rotate" : rotate, "translateinit" : transinit, "rotateinit" : rotateinit, "duration" : duration, "keys" : keysstring, "pc" : pcs, "pctrans" : pctrans, "pctransinit" : pctransinit, "cost" : valcost};
}


function createSymbole(width,s)
{
  var x = x*width;
  var y = y*width;
  switch (s)
  {
    case "circle":
      var newSVGobject =
        createSVGobject("circle",
                         {"cx": width/2.,
                          "cy": width/2.,
                          "r" : width/3.});
      return newSVGobject;

    case "square":
      var newSVGobject =
        createSVGobject("rect",
                         {"x" : width/6.,
                          "y" : width/6.,
                          "width" : width*2./3.,
                          "height": width*2./3.});
      return newSVGobject;

// triangle
    case "triangle":
      var radius = width * .4;
      var points = "";

      for (var i=0; i<3; i++)
      {
        var dx = width/2.+radius*Math.cos(Math.PI*(-1./2.+2./3.*i));
        var dy = width/2.+radius*0.2+radius*Math.sin(Math.PI*(-1./2.+2./3.*i));
        points = points + dx + "," + dy + " ";
      }

      var newSVGobject =
        createSVGobject("polygon",
                         {"points":points});
      return newSVGobject;

//star
    case "star":
      var radius = width * .4;
      var points = "";

      for (var i=0; i<5; i++)
      {
        var dx = width/2.+radius*Math.cos(Math.PI*(-1./2.+4./5.*i));
        var dy = width/2.+radius*Math.sin(Math.PI*(-1./2.+4./5.*i));
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

function coordNale(width)
{
  var points = "";
  var radius = width/4.;
  
  for (var i=-1; i<2; i++)
  {
    dx = width/2.+radius*Math.cos(Math.PI*(-1./2.+4./5.*i));
    dy = width/2.+radius*Math.sin(Math.PI*(-1./2.+4./5.*i))-radius*0.4;
    points = points + dx + "," + dy + " ";
  }
  return points;
}


function createSimulation(start, p, width)
{
  var points = coordNale(width);
  t = transformfromprogram(start,p,width);

  var nale =
    createSVGobject("polygon",
                     {"points":points,
                      "id"    :"nale",
                      "style" : "fill: orange;stroke:black;stroke-width:1px;",
                      "transform": t["rotateinit"]});


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
                       "y": width / 8.,
                       "id": "pcindicator",
                       "width": width / 4.,
                       "height": width / 4.,
                       "style": "fill: green;stroke:black;stroke-width:1px;",
                       "transform": t["pctransinit"]});

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
                      "dur": duration,
                      "calcMode": "discrete"});


  pc.appendChild(pctrans);
  var grouppc =
    createSVGobject("g",
                     {"id" : "pc"});

  grouppc.appendChild(pc);
  for (var i = 0; i < p.length; i++)
  {
    var text = 
      createSVGobject("text",
                       {"x": width/2. * .65,
                        "y": width/2. * (.95+i),
                        "font-size": (width/2.*.9)+"px"});
    text.textContent = p[i][0];
    grouppc.appendChild(text);
  }

  var textcost = 
    createSVGobject("text",
                     {"x": width/2. * .1,
                      "y": width/2. * .95,
                      "font-size": (width/2.*.9)+"px"});
  textcost.textContent = t["cost"];

  simulation = {"map" : groupnale, "exec" : grouppc, "cost" : textcost};
  return simulation;
}

function createMap(width)
{
  var SVGbackgroundtile =
    createSVGobject("g",
                     {"id" : "backgroundtile"});

  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      var color = data.map.colordefault;
      if (data.level.background[i][j] in data.map.color)
        color = data.map.color[data.level.background[i][j]];

      var tile =
        createSVGobject("rect",
                         {"x": "0",
                          "y": "0",
                          "width": width,
                          "height": width,
                          "transform": "translate("+(width*j)+","+(width*i)+")",
                          "style" : "fill:"+color+";stroke:black;stroke-width:1px;"});

      SVGbackgroundtile.appendChild(tile);
    }
  }

  var SVGbackgroundsymb =
    createSVGobject("g",
                     {"id" : "backgroundsymb"});

  for (var i=0; i<12; i++)
  {
    for (var j=0; j<12; j++)
    {
      var color = data.map.symbcolordefault;
      var bngcolor = data.map.symbbngcolordefault;
      if (data.level.background[i][j] in data.map.symbcolor)
        color = data.map.symbcolor[data.level.background[i][j]];
      if (data.level.background[i][j] in data.map.symbbngcolor)
        bngcolor = data.map.symbbngcolor[data.level.background[i][j]];
        
      if (data.level.symb[i][j] in data.map.symb)
      {
        var symbole = createSymbole(width,data.map.symb[data.level.symb[i][j]]);
        if (symbole !== undefined)
        {
          var symbolebng = symbole.cloneNode(true);
          symbolebng.setAttributeNS(null, "transform", "translate("+(width*j)+","+(width*i)+")");
          symbolebng.setAttributeNS(null, "style", "fill:"+bngcolor);
          SVGbackgroundsymb.appendChild(symbolebng); 
          var scale = 0.80;
            
          symbole.setAttributeNS(null, "transform", "translate("+(width*j+(1.-scale)/2.*width)+","+(width*i+(1.-scale)/2.*width)+") scale(+"+scale+")");
          symbole.setAttributeNS(null, "style", "fill:"+color);
          SVGbackgroundsymb.appendChild(symbole);
          
        }
      }
    }
  }

  var SVGmap =
    createSVGobject("g",
                     {"id" : "map"});


  simulation = createSimulation(data.program.start,data.program.content,width);

  var SVGexec =
    createSVGobject("g",
                     {"id" : "execution"});

  SVGmap.appendChild(SVGbackgroundtile);
  SVGmap.appendChild(SVGbackgroundsymb);
  SVGmap.appendChild(simulation["map"]);
  document.rootElement.appendChild(SVGmap);

  simulation["exec"].setAttributeNS(null, "transform", "translate(480, 40)");

  SVGexec.appendChild(simulation["exec"]);
  document.rootElement.appendChild(SVGexec);

  var SVGcost =
    createSVGobject("g",
                     {"id" : "cost"});
  simulation["cost"].setAttributeNS(null, "transform", "translate(480, 0)");
  SVGcost.appendChild(simulation["cost"]);
  document.rootElement.appendChild(SVGcost);


}

function move()
{
  document.getElementById("pcanimationtranslation").beginElement();
}

function init()
{
  createMap(40.);  
  document.rootElement.addEventListener("click", move, false);
}

