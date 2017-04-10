var Army = function (locationName) {
  this.location = MAP[locationName];
  this.units = [];
};

Army.prototype.marchTo = function (territoryName) {
  console.log(this.location);
  this.location = MAP[territoryName];
  console.log(this.location);
  updatePositionDisplay();
  populateTerritoryList();
};

var createPlayerArmy = function () {
  game.armies = [];
  game.playerArmy = new Army ('Arizona');
  game.armies.push(game.playerArmy);
};

var createCloneArmies = function () {
  var newArmy;
  game.cloneArmies = [];
  newArmy = new Army ('');
  game.cloneArmies.push(newArmy);
};
