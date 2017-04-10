game = {};
display = {};

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
  } else if (location.type == 'state' && (location.nation == 'Mexico' || location.flag == 'Mexico')) {
    str = 'Your army is camped in the ' + biomeDescriber + ' of the Mexican State of ' + location.name.toUpperCase() + '.';
  } else if (location.type == 'state') {
    str = 'Your army is camped in the ' + biomeDescriber + ' of the State of ' + location.name.toUpperCase() + '.';
  } else if (location.type == 'province') {
    str = 'Your army is camped in the ' + biomeDescriber + ' of ' + location.name.toUpperCase() + ' Province.';
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
  var borderNames;
  var i;
  var list;
  var territory;
  list = document.getElementById('territory-list');
  list.innerHTML = '';
  borderNames = game.playerArmy.location.borderNames;
  for (i=0 ; i<borderNames.length ; i++) {
    territory = document.createElement('WD-SELECTOR');
    territory.innerText = borderNames[i];
    territory.onclick = function () {
      game.playerArmy.marchTo(this);
    }.bind(borderNames[i])
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
    choose.childNodes[3].childNodes[i].onmouseenter = function () {
      this.windu.changeTitle(this.name);
    }.bind({
      name: choose.childNodes[3].childNodes[i].id,
      windu: windu,
    })
    choose.childNodes[3].childNodes[i].onclick = function () {
      this.choose.parentNode.removeChild(this.choose);
      this.main.style.display = 'block';
      this.windu.changeTitle(this.name);
      this.windu.style.transition = 'min-width .5s, min-height .5s, left .2s, right .5s'
      this.windu.style.width = 'auto'
      this.windu.style.height = 'auto'
      this.windu.style.minWidth = '80%'
      this.windu.style.minHeight = '80%'
      setTimeout (function () {
        this.windu.style.minWidth = '0%'
        this.windu.style.minHeight = '0%'
        this.windu.style.left = '12px'
        this.windu.style.top = '18px'
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
  for (i=0 ; i<choose.childNodes[3].childNodes.length ; i++) {
    choose.childNodes[3].childNodes[i].parentNode.insertBefore(choose.childNodes[3].childNodes[i], choose.childNodes[3].childNodes[Math.floor(Math.random() * 5)]);
  }
};

var setInitialWindowPositions = function (windows) {
  var i;
  var perX;
  var perY;
  var width;
  var windu;
  innerSize = {
    x: window.innerWidth,
    y: window.innerHeight,
  }
  perX = function (px) {
    return Math.floor(px / innerSize.x * 100) + '%';
  }
  perY = function (px) {
    return Math.floor(px / innerSize.y * 100) + '%';
  }
  for (i=0 ; i<windows.length ; i++) {
    windu = windows[i];
    switch (windu.id) {
      case 'Current Position':
        windu.style.left = perX(458);
        windu.style.top = perY(18);
        windu.style.width = perX(786);
        windu.style.height = perY(220);
        break;
      case 'Scout Reports':
        windu.style.left = perX(458);
        windu.style.top = perY(52);
        windu.style.width = perX(786);
        windu.style.height = perY(220);
        break;
      case 'March':
        windu.style.left = perX(12);
        windu.style.top = perY(254);
        windu.style.width = perX(276);
        windu.style.height = perY(440);
        break;
      case 'Attack':
        windu.style.left = perX(306);
        windu.style.top = perY(255);
        windu.style.width = perX(276);
        windu.style.height = perY(440);
        break;
      case 'Commands':
        windu.style.left = perX(602);
        windu.style.top = perY(288);
        windu.style.width = perX(276);
        windu.style.height = perY(166);
        break;
      case 'Troops':
        windu.style.left = perX(900);
        windu.style.top = perY(288);
        windu.style.width = perX(342);
        windu.style.height = perY(166);
        break;
      case 'Supply':
        windu.style.left = perX(602);
        windu.style.top = perY(472);
        windu.style.width = perX(646);
        windu.style.height = perY(224);
        break;
    }
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
