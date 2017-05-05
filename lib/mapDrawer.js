var MapDrawer = function (playerArmy) {
  this.range = {};
  this.range.max = {};
  this.range.min = {};
  this.playerArmy = playerArmy;
  this.offset = {
    x: 0,
    y: 0,
  };
  this.scale = 1;
  this.canvas = document.getElementById('world-map');
  this.ctx = this.canvas.getContext('2d');
};

MapDrawer.prototype.drawMap = function (vectorMap, playerArmy) {
  var largestGap;
  var occupiedTerritories;

  this.ctx.beginPath();
  this.ctx.strokeStyle = '#fff';

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  occupiedTerritories = [];

  for (i=0 ; i<playerArmy.location.borderNames.length ; i++) {
    if (MAP[playerArmy.location.borderNames[i]].flag) {
      occupiedTerritories.push(playerArmy.location.borderNames[i]);
    } else {
      this.drawTerritory(playerArmy.location.borderNames[i], this.offset, this.scale);
    }
  }
  for (i=0 ; i<occupiedTerritories.length ; i++) {
    this.drawTerritory(occupiedTerritories[i], this.offset, this.scale);
  }
  this.drawTerritory(playerArmy.location.name, this.offset, this.scale);
};

MapDrawer.prototype.updateScaleAndOffset = function (territory) {
  var i;
  if (!this.offset.x || this.animating) {
    this.range = this.getMinAndMax(vectorMap, territory);

    largestGap = this.range.gap.y > this.range.gap.x ? this.range.gap.y : this.range.gap.x;

    this.scale = this.canvas.height / largestGap;
    this.offset = {
      x: 0 - this.range.min.x * this.scale,
      y: 0 - this.range.min.y * this.scale,
    };
  } else {

    this.range = this.getMinAndMax(vectorMap, territory);

    largestGap = this.range.gap.y > this.range.gap.x ? this.range.gap.y : this.range.gap.x;

    this.a = {}; this.b = {};

    this.b.scale = this.canvas.height / largestGap;
    this.b.offset = {
      x: 0 - this.range.min.x * this.b.scale,
      y: 0 - this.range.min.y * this.b.scale,
    };

    this.a.scale = this.scale;
    this.a.offset = {
      x: this.offset.x,
      y: this.offset.y,
    };

    if (false) {
      this.offset = this.b.offset;
      this.scale = this.b.scale;
      return false;
    }

    this.animating = true;
    for (i=0 ; i<30 ; i++) {
      setTimeout(function () {
        this.range = this.getMinAndMax(vectorMap, territory);

        largestGap = this.range.gap.y > this.range.gap.x ? this.range.gap.y : this.range.gap.x;

        this.scale = (this.a.scale * (30 - this.i) + this.i * this.b.scale) / 30;
        this.offset = {
          x: (this.a.offset.x * (30 - this.i) + this.i * this.b.offset.x) / 30,
          y: (this.a.offset.y * (30 - this.i) + this.i * this.b.offset.y) / 30,
        };
        this.drawMap(vectorMap, this.playerArmy);
      }.bind({range: this.range, scale: this.scale, getMinAndMax: this.getMinAndMax, drawMap: this.drawMap, a: this.a, b: this.b, i: i, ctx: this.ctx, canvas: this.canvas, playerArmy: this.playerArmy, drawTerritory: this.drawTerritory}), 400 + 24 * i);
    }
    setTimeout(function () {
      this.drawerObject.offset.x = this.b.offset.x;
      this.drawerObject.offset.y = this.b.offset.y;
      this.drawerObject.scale = this.b.scale;
      this.drawerObject.animating = false;

    }.bind({offset: this.offset, scale: this.scale, a: this.a, b: this.b, drawerObject: this}), 400 + 24 * 30);
  }
};

MapDrawer.prototype.drawTerritory = function (territory, offset, scale, color) {
  var i;
  color = color ? color : '#fff';

  if (MAP[territory].flag) {
    color = MAP[territory].flagColor();
  }

  this.ctx.beginPath();
  for (i=0 ; i<vectorMap[territory].length ; i++) {
    if (i === 0) {
      this.ctx.moveTo((vectorMap[territory][i].x * scale + offset.x + (this.canvas.width - this.range.gap.x) / 2), (vectorMap[territory][i].y * scale + offset.y));
    } else {
      this.ctx.lineTo((vectorMap[territory][i].x * scale + offset.x + (this.canvas.width - this.range.gap.x) / 2), (vectorMap[territory][i].y * scale + offset.y));
    }
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = color === '#fff' ? 2 : 4;
    this.ctx.stroke();
  }
  this.ctx.closePath();

  this.ctx.lineTo((vectorMap[territory][0].x * this.scale + this.offset.x + (this.canvas.width - this.range.gap.x) / 2), (vectorMap[territory][0].y * this.scale + this.offset.y));
  this.ctx.stroke();
  this.ctx.strokeStyle = '#fff';
};

MapDrawer.prototype.getMinAndMax = function (vectorMap, location) {
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
  for (k=0 ; k<location.borderNames.length ; k++) {
    plots = plots.concat(vectorMap[location.borderNames[k]]);
  }

  plots = plots.concat(vectorMap[location.name]);

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
