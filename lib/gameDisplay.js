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
    displayString += nearbyArmies[i].flag === game.playerArmy.flag ?
      "There's an allied army in " + nearbyArmies[i].location.name.toUpperCase() + ", flying " + nearbyArmies[i].shortName().toUpperCase() + " colors." :
      "We've spotted another army encamped in " + nearbyArmies[i].location.name.toUpperCase() + ". They're flying " + nearbyArmies[i].shortName().toUpperCase() + " colors.";
    displayString += '<br>';
    displayString += "Their numbers are " + nearbyArmies[i].infantry.count + " infantry, " + nearbyArmies[i].cavalry.count + " cavalry, and " + nearbyArmies[i].artillery.count + " artillery.";
    if (nearbyArmies[i + 1]) {
      displayString += '<br><br>';
    }
  }
  if (!displayString) {
    displayString = "We haven't detected troops on any of our borders.";
  }
  textbox.innerHTML = displayString;
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
      territory.innerText = 'ATTACK ' + territory.innerText.toUpperCase();
      attackList.appendChild(territory);
    }
  }
};

var initializeFactionWindow = function () {
  var choose;
  var i;
  var main;
  var preserveFunction;
  var sidebar;
  var windu;
  windu = document.getElementById('Faction');
  choose = document.getElementById('choose-faction');
  main = document.getElementById('main-faction-window');
  sidebar = document.getElementById('sidebar');
  main.style.display = 'none';
  preserveFunction = windu.childNodes[0].childNodes[0].onclick;
  windu.childNodes[0].childNodes[0].onclick = function () {
    this.preserveFunction();
    this.sidebar.style.left = '0px';
  }.bind({sidebar: sidebar, preserveFunction: preserveFunction});
  for (i=0 ; i<choose.childNodes[3].childNodes.length ; i++) {
    choose.childNodes[3].childNodes[i].onmouseenter = function () {
      this.windu.changeTitle(this.name);
    }.bind({
      name: choose.childNodes[3].childNodes[i].id,
      windu: windu,
    });
    choose.childNodes[3].childNodes[i].onclick = function () {
      game.mapDrawer.updateScaleAndOffset(game.playerArmy.location);
      game.mapDrawer.drawMap(vectorMap, game.playerArmy);
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
        this.windu.style.left = '124px';
        this.windu.style.top = '18px';
      }.bind(this), 50);
      setTimeout (function () {
        this.windu.style.transition = '';
      }.bind(this), 550);
      sidebar.style.left = '0px';
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
  setupSidebar();
};

var setupSidebar = function () {
  var currentPosition;
  var faction;
  var scoutReports;
  var sidebar;
  var troops;

  sidebar = document.getElementById('sidebar');
  sidebar.faction = document.getElementById('icon-faction');
  sidebar.scoutReports = document.getElementById('icon-scout-reports');
  sidebar.currentPosition = document.getElementById('icon-current-position');
  sidebar.troops = document.getElementById('icon-troops');

  sidebar.faction.windu = document.getElementById('Faction');
  sidebar.scoutReports.windu = document.getElementById('Scout Reports');
  sidebar.currentPosition.windu = document.getElementById('Current Position');
  sidebar.troops.windu = document.getElementById('Troops');

  sidebar.faction.onclick = function () {
    openWindow('Faction');
    closeWindow('Troops');
    closeWindow('Scout Reports');
    closeWindow('Current Position');
    closeWindow('Commands');
    closeWindow('Attack');
    closeWindow('March');
    closeWindow('Supply');
  };
  sidebar.scoutReports.onclick = function () {
    openWindow('Scout Reports');
  };
  sidebar.currentPosition.onclick = function () {
    openWindow('Current Position');
  };
  sidebar.troops.onclick = function () {
    openWindow('Troops');
  };

  sidebar.highlightIcon = function (icon) {
    var flashing;
    this[icon].style.background = 'rgb(68, 187, 68)';
    this[icon].style.color = 'rgb(0, 0, 0)';
    clearInterval(this[icon].flashing);
    this[icon].flashing = setInterval(function () {
      this.style.background = this.style.background === 'rgb(0, 0, 0)' ? 'rgb(68, 187, 68)' : 'rgb(0, 0, 0)';
      this.style.color = this.style.color === 'rgb(0, 0, 0)' ? 'rgb(68, 187, 68)' : 'rgb(0, 0, 0)';
      if (this.windu.className === 'open') {
        clearInterval(this.flashing);
        this.style.background = 'rgb(0, 0, 0)';
        this.style.color = 'rgb(68, 187, 68)';
      }
    }.bind(this[icon]), 800 + Math.round(Math.random() * 20));
  };
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
  document.getElementById('select-bayonets').onclick = setInfantryFormation.bind('bayonets');

  document.getElementById('select-sabers').onclick = setCavalryDisposition.bind('sabers');
  document.getElementById('select-rifles').onclick = setCavalryDisposition.bind('rifles');

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
  disposition.innerText = 'Primary Weapon: ' + game.playerArmy.cavalry.disposition.toUpperCase();

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
    return Math.floor(px / 1450 * 100) + '%';
  };
  perY = function (px) {
    return Math.floor(px / 820 * 100) + '%';
  };
  for (i=0 ; i<windows.length ; i++) {
    windu = windows[i];
    switch (windu.id) {
      case 'Current Position':
        windu.style.left = perX(458);
        windu.style.top = perY(18);
        windu.style.width = perX(786);
        windu.style.height = 'auto';
        break;
      case 'Scout Reports':
        windu.style.left = perX(458);
        windu.style.top = perY(52);
        windu.style.width = perX(786);
        windu.style.height = 'auto';
        break;
      case 'March':
        windu.style.left = perX(152);
        windu.style.top = perY(254);
        windu.style.width = perX(286);
        windu.style.height = 'auto';
        break;
      case 'Attack':
        windu.style.left = perX(346);
        windu.style.top = perY(255);
        windu.style.width = perX(680);
        windu.style.height = 'auto';
        break;
      case 'Commands':
        windu.style.left = perX(732);
        windu.style.top = perY(288);
        windu.style.width = perX(276);
        windu.style.height = 'auto';
        break;
      case 'Troops':
        windu.style.left = perX(732);
        windu.style.top = perY(464);
        windu.style.width = 'auto';
        windu.style.height = 'auto';
        break;
      case 'Supply':
        windu.style.left = perX(1024);
        windu.style.top = perY(288);
        windu.style.width = perX(256);
        windu.style.height = 'auto';
        break;
    }
  }
};
