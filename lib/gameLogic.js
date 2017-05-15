game = {};
display = {};

var checkForBorderingArmies = function (territory) {
  var borderingArmies;
  var i;
  borderingArmies = [];
  for (i=0 ; i<game.armies.length; i++) {
    if (territory.borderNames.includes(game.armies[i].location.name)) {
      borderingArmies.push(game.armies[i]);
    }
  }
  return borderingArmies;
};

game.manageRound = function () {
  var i;
  var victory;
  victory = true;
  for (i=0 ; i<this.armies.length ; i++) {
    if (this.armies[i] && this.armies[i].general) {
      this.armies[i].general.act();
      if (this.armies[i] && this.armies[i].flag !== game.playerArmy.flag) {
        victory = false;
      }
    }
  }
  if (victory) {
    document.getElementById("Faction").childNodes[0].childNodes[2].innerText = "Victory! You control the West.";
  }
  for (i=0 ; i<Object.keys(MAP).length ; i++) {
    MAP[Object.keys(MAP)[i]].develop();
  }
  updatePositionDisplay();
  updateScoutDisplay();
  updateSupplyDisplay();
  populateTerritoryList();
  game.mapDrawer.drawMap(vectorMap, game.playerArmy);
  game.mapDrawer.updateScaleAndOffset(game.playerArmy.location);
};

createPlayerArmy();

onload = function () {
  initializeWindows();
  initializeDisplay();
  initializeFactionWindow();
  initializeTroopsWindow();
  initializeSelectors();
  populateTerritoryList();
  game.mapDrawer = new MapDrawer (game.playerArmy);
};
