var drawMap = function (vectorMap, playerArmy) {
  var canvas;
  var ctx;
  var i; var j;
  var offset;
  var range;
  var scale;
  range = {};
  range.max = {};
  range.min = {};
  offset = {
    x: 0,
    y: 0,
  };
  scale = 1;
  canvas = document.getElementById('world-map');
  ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.strokeStyle = '#fff';

  range = getMinAndMax(vectorMap, playerArmy);
  scale = canvas.height / range.gap.y;
  offset = {
    x: 0 - range.min.x * scale,
    y: 0 - range.min.y * scale,
  };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTerritory(ctx, playerArmy.location.name, scale, offset);
  for (i=0 ; i<playerArmy.location.borderNames.length ; i++) {
    drawTerritory(ctx, playerArmy.location.borderNames[i], scale, offset);
  }
};

var drawTerritory = function (ctx, territory, scale, offset) {
  var i;
  for (i=0 ; i<vectorMap[territory].length ; i++) {
    if (i===0) {
      ctx.moveTo((vectorMap[territory][i].x * scale + offset.x), (vectorMap[territory][i].y * scale + offset.y));
    } else {
      ctx.lineTo((vectorMap[territory][i].x * scale + offset.x), (vectorMap[territory][i].y * scale + offset.y));
    }
    ctx.stroke();
  }

  ctx.lineTo((vectorMap[territory][0].x * scale + offset.x), (vectorMap[territory][0].y * scale + offset.y));
  ctx.stroke();
};

var getMinAndMax = function (vectorMap, playerArmy) {
  var k;
  var range;
  var territories;
  var x;
  var y;
  x = {
    min: false,
    max: false,
  };
  y = {
    min: false,
    max: false,
  };
  range = {};
  plots = [];
  for (k=0 ; k<playerArmy.location.borderNames.length ; k++) {
    plots = plots.concat(vectorMap[playerArmy.location.borderNames[k]]);
  }

  plots = plots.concat(vectorMap[playerArmy.location.name]);

  for (k=0 ; k<plots.length ; k++) {
    if (x.min === false || plots[k].x < x.min) {
      x.min = plots[k].x;
    }
    if (x.max === false || plots[k].x > x.max) {
      x.max = plots[k].x;
    }
    if (y.min === false || plots[k].y < y.min) {
      y.min = plots[k].y;
    }
    if (y.max === false || plots[k].y > y.max) {
      y.max = plots[k].y;
    }
  }

  return {
    min: {
      x: x.min,
      y: y.min,
    },
    max: {
      x: x.max,
      y: y.max,
    },
    gap: {
      x: x.max - x.min,
      y: y.max - y.min,
    },
  };
};
