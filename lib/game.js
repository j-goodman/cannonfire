game = {};
display = {};

var Army = function (locationName) {
  this.location = MAP[locationName];
  this.units = [];
};

var createPlayerArmy = function () {
  game.playerArmy = new Army ('Arizona');
};

var updatePositionDisplay = function () {
  var biomeDescriber;
  var borderNames;
  var bordersString;
  var i;
  var location;
  location = game.playerArmy.location;
  display.currentPosition.innerText = getLocationString(location)
  bordersString = '';
  borderNames = location.borderNames;
  for (i=0 ; i<borderNames.length ; i++) {
    bordersString += borderNames[i].toUpperCase();
    if (i == borderNames.length - 1) {
      bordersString += '.'
    } else if (i == borderNames.length - 2) {
      bordersString += ', and '
    } else {
      bordersString += ', '
    }
  }
  display.currentBorders.innerText = 'From here you can travel to ' + bordersString;
};

var getBiomeString = function (biome) {
  var str
  switch (biome) {
    case 'arctic':
      str = 'snow-battered plains'
      break;
    case 'taiga':
      str = 'frost-choked forests'
      break;
    case 'forest':
      str = 'deep pine forests'
      break;
    case 'mountains':
      str = 'treacherous mountain passes'
      break;
    case 'desert':
      str = 'vast scorched deserts'
      break;
    case 'saltflats':
      str = 'wide open saltflats'
      break;
    case 'prairie':
      str = 'vast grassy plains'
      break;
    case 'hills':
      str = 'rocky hills'
      break;
    case 'swamp':
      str = 'deep forested swamps'
      break;
  }
  return str;
}

var getLocationString = function (location) {
  var biomeDescriber;
  var str;
  biomeDescriber = getBiomeString(location.biome);
  if (location.type == 'territory') {
    str = 'Your army is camped in the ' + biomeDescriber + ' of ' + location.name.toUpperCase() + ' Territory.';
  } else if (location.type == 'state') {
    str = 'Your army is camped in the ' + biomeDescriber + ' of the State of ' + location.name.toUpperCase() + '.';
  } else if (location.type == 'province') {
    str = 'Your army is camped in the ' + biomeDescriber + ' of ' + location.name.toUpperCase() + 'Province.';
  }
  return str;
}

var initializeDisplay = function () {
  display.currentPosition = document.getElementById('current-territory');
  display.currentBorders = document.getElementById('current-borders');
  updatePositionDisplay();
}

var initializeSelectors = function () {
  var attack;
  var i;
  var march;
  var selectors;
  var supply;
  selectors = document.getElementsByTagName('wd-selector');
  attack = document.getElementById('item-attack');
  march = document.getElementById('item-march');
  supply = document.getElementById('item-supply');
  for (i=0 ; i<selectors.length ; i++) {
    attack.onclick = openWindow.bind(null, 'Attack');
    march.onclick = openWindow.bind(null, 'March');
    supply.onclick = openWindow.bind(null, 'Supply');
  }
}

createPlayerArmy();
onload = function () {
  initializeWindows();
  initializeDisplay();
  initializeSelectors();
};
