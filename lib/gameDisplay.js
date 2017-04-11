var updatePositionDisplay = function () {
  var biomeDescriber;
  var borderNames;
  var bordersString;
  var i;
  var location;
  location = game.playerArmy.location;
  display.currentPosition.innerText = getLocationString(location);
  bordersString = '';
  borderNames = location.borderNames;
  for (i=0 ; i<borderNames.length ; i++) {
    bordersString += borderNames[i].toUpperCase();
    if (i == borderNames.length - 1) {
      bordersString += '.';
    } else if (i == borderNames.length - 2) {
      bordersString += ', and ';
    } else {
      bordersString += ', ';
    }
  }
  display.currentBorders.innerText = 'From here you can travel to ' + bordersString;
};

var updateScoutDisplay = function () {
  var displayString;
  var i;
  var nearbyArmies;
  var textbox;
  displayString = "";
  nearbyArmies = checkForBorderingArmies(game.playerArmy.location);
  textbox = document.getElementById('scout-text');
  for (i=0 ; i<nearbyArmies.length ; i++) {
    displayString += "We've spotted another army encamped in " + nearbyArmies[i].location.name.toUpperCase() + ". They're flying " + nearbyArmies[i].shortName().toUpperCase() + " colors.";
    if (nearbyArmies[i + 1]) {
      displayString += '<br><br>';
    }
  }
  if (!displayString) {
    displayString = "We haven't detected troops on any of our borders.";
  }
  textbox.innerText = displayString;
};

var getBiomeString = function (biome) {
  var str;
  switch (biome) {
    case 'arctic':
      str = 'snow-battered plains';
      break;
    case 'taiga':
      str = 'frost-choked forests';
      break;
    case 'forest':
      str = 'deep pine forests';
      break;
    case 'mountains':
      str = 'treacherous mountain passes';
      break;
    case 'desert':
      str = 'vast scorched deserts';
      break;
    case 'saltflats':
      str = 'wide open saltflats';
      break;
    case 'prairie':
      str = 'vast grassy plains';
      break;
    case 'hills':
      str = 'rocky hills';
      break;
    case 'swamp':
      str = 'deep forested swamps';
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
  updateScoutDisplay(game.playerArmy.location);
};

var initializeSelectors = function () {
  var attack;
  var march;
  var position;
  var scouts;
  var selectors;
  var supply;
  var troops;

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
};

var populateTerritoryList = function () {
  var borderNames;
  var i;
  var list;
  var territory;
  marchList = document.getElementById('territory-list');
  marchList.innerHTML = '';
  attackList = document.getElementById('attack-list');
  attackList.innerHTML = '';
  borderNames = game.playerArmy.location.borderNames;
  for (i=0 ; i<borderNames.length ; i++) {
    territory = document.createElement('WD-SELECTOR');
    territory.innerText = borderNames[i];
    if (!MAP[borderNames[i]].flag || MAP[borderNames[i]].flag == game.playerArmy.flag) {
      territory.onclick = function () {
        game.playerArmy.marchTo(this);
      }.bind(borderNames[i]);
      marchList.appendChild(territory);
    } else {
      territory.onclick = function () {
        game.playerArmy.attack(this);
      }.bind(borderNames[i]);
      attackList.appendChild(territory);
    }
  }
};

var initializeFactionWindow = function () {
  var choose;
  var i;
  var main;
  var windu;
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
    });
    choose.childNodes[3].childNodes[i].onclick = function () {
      this.choose.parentNode.removeChild(this.choose);
      this.main.style.display = 'block';
      this.windu.changeTitle(this.name);
      this.windu.style.transition = 'min-width .5s, min-height .5s, left .2s, right .5s';
      this.windu.style.width = 'auto';
      this.windu.style.height = 'auto';
      this.windu.style.minWidth = '80%';
      this.windu.style.minHeight = '80%';
      setTimeout (function () {
        this.windu.style.minWidth = '0%';
        this.windu.style.minHeight = '0%';
        this.windu.style.left = '12px';
        this.windu.style.top = '18px';
      }.bind(this), 50);
      setTimeout (function () {
        this.windu.style.transition = '';
      }.bind(this), 550);
      game.playerArmy.flag = this.name;
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

var initializeTroopsWindow = function () {
  var setArtilleryTarget;
  var setCavalryDisposition;
  var setInfantryFormation;
  updateTroopsWindow();
  intializeSubwindowSelector();

  setInfantryFormation = function () {
    game.playerArmy.infantry.formation = this;
    updateTroopsWindow();
  };

  setCavalryDisposition = function () {
    game.playerArmy.cavalry.disposition = this;
    updateTroopsWindow();
  };

  setArtilleryTarget = function () {
    game.playerArmy.artillery.target = this;
    updateTroopsWindow();
  };

  document.getElementById('select-line').onclick = setInfantryFormation.bind('line');
  document.getElementById('select-column').onclick = setInfantryFormation.bind('column');
  document.getElementById('select-square').onclick = setInfantryFormation.bind('square');

  document.getElementById('select-defensive').onclick = setCavalryDisposition.bind('defensive');
  document.getElementById('select-aggressive').onclick = setCavalryDisposition.bind('aggressive');

  document.getElementById('select-infantry-target').onclick = setArtilleryTarget.bind('infantry');
  document.getElementById('select-cavalry-target').onclick = setArtilleryTarget.bind('cavalry');
  document.getElementById('select-artillery-target').onclick = setArtilleryTarget.bind('artillery');
};

var intializeSubwindowSelector = function () {
  var artillery;
  var cavalry;
  var infantry;
  var selector;

  selector = document.getElementById('troops-selector');

  infantry = document.getElementById('troops-infantry');
  cavalry = document.getElementById('troops-cavalry');
  artillery = document.getElementById('troops-artillery');

  infantry.style.display = 'none';
  cavalry.style.display = 'none';
  artillery.style.display = 'none';

  document.getElementById('select-infantry-subwindow').onclick = function () {
    infantry.style.display = 'block';
    cavalry.style.display = 'none';
    artillery.style.display = 'none';
  };
  document.getElementById('select-cavalry-subwindow').onclick = function () {
    infantry.style.display = 'none';
    cavalry.style.display = 'block';
    artillery.style.display = 'none';
  };
  document.getElementById('select-artillery-subwindow').onclick = function () {
    infantry.style.display = 'none';
    cavalry.style.display = 'none';
    artillery.style.display = 'block';
  };

};

var updateTroopsWindow = function () {
  var artilleryCount;
  var cavalryCount;
  var disposition;
  var formation;
  var infantryCount;
  var target;

  // INFANTRY
  infantryCount = document.getElementById('select-infantry-subwindow');
  formation = document.getElementById('infantry-formation-display');

  infantryCount.innerText = 'INFANTRY: ' + game.playerArmy.infantry.count + ', (' + game.playerArmy.infantry.formation.toUpperCase() + ')';
  formation.innerText = 'Formation: ' + game.playerArmy.infantry.formation.toUpperCase();

  // CAVALRY
  cavalryCount = document.getElementById('select-cavalry-subwindow');
  disposition = document.getElementById('cavalry-disposition-display');

  cavalryCount.innerText = 'CAVALRY: ' + game.playerArmy.cavalry.count + ', (' + game.playerArmy.cavalry.disposition.toUpperCase() + ')';
  disposition.innerText = 'Disposition: ' + game.playerArmy.cavalry.disposition.toUpperCase();

  // ARTILLERY
  artilleryCount = document.getElementById('select-artillery-subwindow');
  target = document.getElementById('artillery-target-display');

  artilleryCount.innerText = 'ARTILLERY: ' + game.playerArmy.artillery.count + ', (' + game.playerArmy.artillery.target.toUpperCase() + ')';
  target.innerText = 'Targeting: ' + game.playerArmy.artillery.target.toUpperCase();
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
  };
  perX = function (px) {
    return Math.floor(px / innerSize.x * 100) + '%';
  };
  perY = function (px) {
    return Math.floor(px / innerSize.y * 100) + '%';
  };
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
        windu.style.width = perX(406);
        windu.style.height = perY(440);
        break;
      case 'Commands':
        windu.style.left = perX(732);
        windu.style.top = perY(288);
        windu.style.width = perX(276);
        windu.style.height = perY(166);
        break;
      case 'Troops':
        windu.style.left = perX(732);
        windu.style.top = perY(464);
        windu.style.width = 'auto';
        windu.style.height = '173px';
        break;
      case 'Supply':
        windu.style.left = perX(1024);
        windu.style.top = perY(288);
        windu.style.width = perX(256);
        windu.style.height = perY(166);
        break;
    }
  }
};