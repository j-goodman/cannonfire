var Army = function (locationName, flag, strength) {
  this.location = MAP[locationName];
  this.flag = flag;
  this.location.flag = this.flag;
  this.infantry = {
    count: Math.floor(strength / 2) + 3,
    formation: 'line',
  };
  this.cavalry = {
    count: Math.floor((strength + 1) / 2),
    disposition: 'defensive',
  };
  this.artillery = {
    count: Math.floor((strength + 4) / 5),
    target: 'infantry',
  };
  this.isPlayer = false;
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
  attackNote.childNodes[2].innerText = "Attacking between territories hasn't been fully implemented yet.";
  this.engageArmies(this, this.location.tenantAt(territoryName), document.getElementById('battle-report'));
};

Army.prototype.rollDice = function (sides, num, countMethod) {
  /*
  countMethod is either:
  'advantage': Roll multiple dice and take the highest value
  'disadvantage': Roll multiple dice and take the lowest value
  'sum': Roll multiple dice and sum up their values
  */
  var i;
  var result;
  var results;
  if (!countMethod) { countMethod = 'sum'; }
  if (!num) { num = 1; }
  if (typeof sides === 'number') {
    sidesArray = [];
    for (i=0 ; i<sides ; i++) {
      sidesArray.push(i);
    }
    sides = sidesArray;
  }
  results = [];
  for (i=0 ; i<num ; i++) {
    results.push( sides[Math.floor(Math.random() * sides.length)] );
  }
  switch (countMethod) {
    case 'advantage':
      result = Math.max.apply( Math, results );
      break;
    case 'disadvantage':
      result = Math.min.apply( Math, results );
      break;
    case 'sum':
      result = 0;
      for (i=0 ; i<results.length ; i++) {
        result += results[i];
      }
      break;
  }
  return result;
};

Army.prototype.flipCoins = function (num) {
  return Math.floor(Math.random() * (num + 1));
};

Army.prototype.engageArmies = function (attacker, defender, commentatorNode) {
  var awayTurf;
  var commenter;
  var damageCap;
  var homeTurf;
  var i;
  awayTurf = attacker.location;
  homeTurf = attacker.location;

  commenter = {
    lineBreak: function () {
      if (commentatorNode) {
        commentatorNode.innerHTML += '<br>';
      }
    },

    say: function (text) {
      if (commentatorNode) {
        commentatorNode.innerText += text;
      }
    },

    maybeSay: function (text, odds) {
      if (commentatorNode && (!Math.floor(Math.random() * odds))) {
        commentatorNode.innerText += text;
      }
    },

    clear: function () {
      if (commentatorNode) {
        commentatorNode.innerText = '';
      }
    },

    isEmpty: function () {
      if (commentatorNode) {
        return commentatorNode.innerText === '';
      }
    },

    equals: function (text) {
      if (commentatorNode) {
        return commentatorNode.innerHTML === text;
      }
    },
  };
  commenter.clear();

  attacker.kills = {
    infantry: 0,
    cavalry: 0,
    artillery: 0,
  };
  defender.kills = {
    infantry: 0,
    cavalry: 0,
    artillery: 0,
  };

  damageCap = 12;

  attacker.infantryBattle(attacker, defender, commenter);
  attacker.infantryBattle(defender, attacker, commenter);
  attacker.cavalryBattle(attacker, defender, commenter);
  attacker.cavalryBattle(defender, attacker, commenter);
  attacker.artilleryBattle(attacker, defender, commenter);
  attacker.artilleryBattle(defender, attacker, commenter);

  attacker.subtractTroops(defender, commenter);
  defender.subtractTroops(attacker, commenter);
};

Army.prototype.infantryBattle = function (attacker, defender, commenter) {
  var antiArtilleryDice;
  var antiCavalryDice;
  var antiInfantryDice;
  var artilleryKills;
  var cavalryKills;
  var infantryKills;

  antiInfantryDice  = [0, 1, 1, 2, 2, 3, 4, 5, 7];
  antiCavalryDice   = [0, 0, 1, 1, 2, 2, 3, 4, 5];
  antiArtilleryDice = [0, 0, 0, 0, 0, 0, 1, 1, 2];

  if (defender.cavalry.dispositon == 'defensive') {
    antiCavalryDice = [0, 1, 1, 2, 2, 3, 4, 5, 6];
  }

  if (attacker.infantry.formation == 'line') {
    infantryKills = this.rollDice(antiInfantryDice, 1);
    if (infantryKills > 2 && attacker.infantry.count > 0 && defender.infantry.count > 1) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Shooting from line formation has let our infantry release a devastating volley on the enemy's infantry." :
        "> Shooting from line formation has let their infantry release a devastating volley on our own foot soldiers.",
      6);
      commenter.lineBreak();
    }
  } else {
    infantryKills = this.rollDice(antiInfantryDice, 2, 'disadvantage');
  }

  infantryKills = infantryKills < attacker.infantry.count ? infantryKills : attacker.infantry.count;

  defender.kills.infantry += infantryKills;

  if (defender.cavalry.disposition == 'aggressive') {
    cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
  } else {
    cavalryKills = this.rollDice(antiCavalryDice, 1);
    if (cavalryKills > 1 && attacker.infantry.count > 0 && defender.cavalry.count > 1) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> The enemy cavalry's defensiveness is making them easy targets for our infantry." :
        "> Our cavalry's defensiveness is making them easy targets for enemy infantry.",
      6);
      commenter.lineBreak();
    }
  }
  cavalryKills = cavalryKills < attacker.infantry.count ? cavalryKills : attacker.infantry.count;

  defender.kills.cavalry += cavalryKills;

  if (attacker.infantry.formation == 'line') {
    artilleryKills = this.rollDice(antiArtilleryDice, 2, 'disadvantage');
    if (artilleryKills > 0 && attacker.infantry.count > 0 && defender.artillery.count > 0) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our infantry's wide breadth of fire is effective against their artillery." :
        "> Their infantry's wide breadth of fire is having a terrible effect against our artillery.",
      6);
      commenter.lineBreak();
    }
  } else {
    artilleryKills = this.rollDice(antiArtilleryDice, 3, 'disadvantage');
  }

  defender.kills.artillery += artilleryKills;
};

Army.prototype.cavalryBattle = function (attacker, defender, commenter) {
  var antiArtilleryDice;
  var antiCavalryDice;
  var antiInfantryDice;
  var artilleryKills;
  var cavalryKills;
  var infantryKills;

  antiInfantryDice  = [1, 1, 2, 3, 3, 4, 4, 5, 7];
  antiCavalryDice   = [0, 1, 1, 2, 2, 3, 4, 5, 6];
  antiArtilleryDice = [0, 0, 0, 0, 0, 0, 1, 1, 1];

  if (defender.infantry.formation == 'line') {
    infantryKills = this.rollDice(antiInfantryDice, 2, 'advantage');
  } else {
    infantryKills = this.rollDice(antiInfantryDice, 1);
  }

  infantryKills = infantryKills < attacker.cavalry.count ? infantryKills : attacker.cavalry.count;

  defender.kills.infantry += infantryKills;

  if (this.disposition == 'defensive') {
    cavalryKills = this.rollDice(antiCavalryDice, 1);
    if (cavalryKills > 1 && attacker.cavalry.count > 0 && defender.cavalry.count > 1 && defender.cavalry.disposition == 'aggressive') {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our cavalry's cautiousness gives them the advantage over the enemy's." :
        "> Their cavalry's cautiousness gives them the advantage over our own.",
      6);
      commenter.lineBreak();
    }
  } else {
    cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
  }

  cavalryKills = cavalryKills < attacker.cavalry.count ? cavalryKills : attacker.cavalry.count;

  defender.kills.cavalry += cavalryKills;

  artilleryKills = this.rollDice(antiArtilleryDice, 2, 'disadvantage');
  defender.kills.artillery += artilleryKills;
};

Army.prototype.artilleryBattle = function (attacker, defender, commenter) {
  var antiArtilleryDice;
  var antiCavalryDice;
  var antiInfantryDice;
  var artilleryKills;
  var cavalryKills;
  var infantryKills;

  antiInfantryDice  = [0, 1, 1, 1, 2, 2, 3, 4, 6];
  antiCavalryDice   = [0, 0, 1, 1, 2, 2, 3, 3, 4];
  antiArtilleryDice = [0, 0, 0, 0, 0, 0, 0, 1, 1];

  infantryKills = this.rollDice(antiInfantryDice, 2, 'disadvantage');
  cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
  artilleryKills = this.rollDice(antiArtilleryDice, 2, 'disadvantage');
  switch (this.target) {
    case 'infantry':
      infantryKills = this.rollDice(antiInfantryDice, 2, 'advantage');
      break;
    case 'cavalry':
      cavalryKills = this.rollDice(antiCavalryDice, 2, 'advantage');
      break;
    case 'artillery':
      artilleryKills = this.rollDice(antiArtilleryDice, 2, 'advantage');
      break;
  }

  infantryKills += this.rollDice(antiInfantryDice, 3, 'disadvantage') * (attacker.artillery.count - 1);
  cavalryKills += this.rollDice(antiCavalryDice, 3, 'disadvantage') * (attacker.artillery.count - 1);
  artilleryKills += this.rollDice(antiArtilleryDice, 3, 'disadvantage') * (attacker.artillery.count - 1);
};

Army.prototype.subtractTroops = function (attacker, commenter) {

  this.kills.infantry = this.kills.infantry < this.infantry.count ? this.kills.infantry : this.infantry.count;
  this.kills.cavalry = this.kills.cavalry < this.cavalry.count ? this.kills.cavalry : this.cavalry.count;
  this.kills.artillery = this.kills.artillery < this.artillery.count ? this.kills.artillery : this.artillery.count;

  this.infantry.count -= this.kills.infantry;
  this.cavalry.count -= this.kills.cavalry;
  this.artillery.count -= this.kills.artillery;

  if (this.isPlayer && this.kills.artillery) {
    commenter.say("> They destroyed " + this.kills.artillery + " of our artillery pieces.");
    commenter.lineBreak();
  } else if (attacker.isPlayer && this.kills.artillery) {
    commenter.say("> We destroyed " + this.kills.artillery + " of their artillery pieces!");
    commenter.lineBreak();
  }

  if (this.isPlayer && this.kills.cavalry) {
    commenter.say("> They killed " + this.kills.cavalry + " of our cavalrymen.");
    commenter.lineBreak();
  } else if (attacker.isPlayer && this.kills.cavalry) {
    commenter.say("> We destroyed " + this.kills.cavalry + " of their cavalry.");
    commenter.lineBreak();
  }

  if (this.isPlayer && this.kills.infantry) {
    commenter.say("> They killed " + this.kills.infantry + " of our infantrymen.");
    commenter.lineBreak();
  } else if (attacker.isPlayer && this.kills.infantry) {
    commenter.say("> We killed " + this.kills.infantry + " of their infantrymen.");
    commenter.lineBreak();
  }

  updateTroopsWindow();
  updateScoutDisplay();
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
  game.playerArmy = new Army ('Arizona', null, 24);
  game.playerArmy.isPlayer = true;
  game.armies.push(game.playerArmy);
};

var createCloneArmies = function () {
  var newArmy;
  game.cloneArmies = [];
  newArmy = new Army ('Utah', 'Confederate States of America', 7);
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
  newArmy = new Army ('Louisiana', 'French Empire', 5);
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
  newArmy = new Army ('Manitoba', 'Coalition of Freedmen', 8);
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
};
