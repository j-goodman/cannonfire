var Army = function (locationName, flag) {
  this.location = MAP[locationName];
  this.flag = flag;
  this.location.flag = this.flag;
  this.infantry = {
    count: 8,
    formation: 'line',
  };
  this.cavalry = {
    count: 3,
    disposition: 'defensive',
  };
  this.artillery = {
    count: 1,
    target: 'infantry',
  };
};

Army.prototype.marchTo = function (territoryName) {
  this.location.flag = '';
  this.location = MAP[territoryName];
  this.location.flag = this.flag;
  updatePositionDisplay();
  updateScoutDisplay();
  populateTerritoryList();
};

Army.prototype.attack = function (territoryName) {
  var attackNote;
  attackNote = document.getElementById('Attack');
  attackNote.childNodes[2].innerText = "Attacking between territories hasn't been implemented yet.";
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
  newArmy = new Army ('Louisiana', 'French Empire');
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
};
