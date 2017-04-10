var Army = function (locationName, flag) {
  this.location = MAP[locationName];
  this.units = [];
  this.flag = flag;
};

Army.prototype.marchTo = function (territoryName) {
  this.location = MAP[territoryName];
  updatePositionDisplay();
  updateScoutDisplay();
  populateTerritoryList();
};

Army.prototype.shortName = function () {
  switch (this.flag) {
    case "French Empire":
      return "French";
    case "Confederate States of America":
      return "Confederate";
    case "British Empire":
      return "British";
    case "Coalition of Freedmen":
      return "Coalition";
    case "United Mexican States":
      return "Mexican";
    case "United States of America":
      return "Union";
  }
};

var createPlayerArmy = function () {
  game.armies = [];
  game.playerArmy = new Army ('Arizona', null);
  game.armies.push(game.playerArmy);
};

var createCloneArmies = function () {
  var newArmy;
  game.cloneArmies = [];
  newArmy = new Army ('Utah', 'Confederate States of America');
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
};
