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

createPlayerArmy();
createCloneArmies();

onload = function () {
  initializeWindows();
  initializeDisplay();
  initializeFactionWindow();
  initializeTroopsWindow();
  initializeSelectors();
  populateTerritoryList();
};
