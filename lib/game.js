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
};

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
};

var initializeDisplay = function () {
  display.currentPosition = document.getElementById('current-territory');
  display.currentBorders = document.getElementById('current-borders');
  updatePositionDisplay();
};

var initializeSelectors = function () {
  var attack;
  var march;
  var position;
  var scouts;
  var selectors;
  var supply;
  var troops

  attack = document.getElementById('item-attack');
  march = document.getElementById('item-march');
  supply = document.getElementById('item-supply');

  commands = document.getElementById('item-commands');
  troops = document.getElementById('item-troops');
  position = document.getElementById('item-position');
  scouts = document.getElementById('item-scouts');

  attack.onclick = openWindow.bind(null, 'Attack');
  march.onclick = openWindow.bind(null, 'March');
  supply.onclick = openWindow.bind(null, 'Supply');

  commands.onclick = openWindow.bind(null, 'Commands');
  troops.onclick = openWindow.bind(null, 'Troops');
  position.onclick = openWindow.bind(null, 'Current Position');
  scouts.onclick = openWindow.bind(null, 'Scout Reports');
}

var populateTerritoryList = function () {
  console.log('Populating list...');
  var borderNames;
  var i;
  var list;
  var territory;
  list = document.getElementById('territory-list');
  borderNames = game.playerArmy.location.borderNames;
  for (i=0 ; i<borderNames.length ; i++) {
    console.log(borderNames[i]);
    territory = document.createElement('WD-SELECTOR');
    territory.innerText = borderNames[i];
    list.appendChild(territory);
  }
};

var initializeFactionWindow = function () {
  var choose;
  var i;
  var main;
  windu = document.getElementById('Faction');
  choose = document.getElementById('choose-faction');
  main = document.getElementById('main-faction-window');
  main.style.display = 'none';
  for (i=0 ; i<choose.childNodes[3].childNodes.length ; i++) {
    choose.childNodes[3].childNodes[i].onclick = function () {
      this.choose.parentNode.removeChild(this.choose);
      this.main.style.display = 'block';
      this.windu.changeTitle(this.name);
      this.windu.style.transition = 'min-width .5s, min-height .5s'
      this.windu.style.width = 'auto'
      this.windu.style.height = 'auto'
      this.windu.style.minWidth = '80%'
      this.windu.style.minHeight = '80%'
      setTimeout (function () {
        this.windu.style.minWidth = '0%'
        this.windu.style.minHeight = '0%'
      }.bind(this), 50);
      setTimeout (function () {
        this.windu.style.transition = ''
      }.bind(this), 550);
    }.bind({
      choose: choose,
      main: main,
      windu: windu,
      name: choose.childNodes[3].childNodes[i].id,
    });
  }
};

createPlayerArmy();

onload = function () {
  initializeWindows();
  initializeDisplay();
  initializeFactionWindow();
  initializeSelectors();
  populateTerritoryList();
};

console.log(borderNames[i]);
