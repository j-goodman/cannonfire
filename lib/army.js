var Army = function (locationName, flag, strength) {
  this.location = MAP[locationName];
  this.flag = flag;
  this.location.flag = this.flag;
  this.infantry = {
    count: Math.floor(strength * 1.5) + 3,
    formation: 'line',
  };
  this.cavalry = {
    count: Math.floor((strength + 1) / 1.5),
    disposition: 'sabers',
  };
  this.artillery = {
    count: Math.floor((strength + 4) / 5),
    target: 'infantry',
  };
  this.isPlayer = false;
};

Army.prototype.marchTo = function (territoryName) {
  var sidebar;
  var positionWindow;
  sidebar = document.getElementById('sidebar');
  positionWindow = document.getElementById('Current Position');
  this.location.flag = '';
  this.location = MAP[territoryName];
  this.location.flag = this.flag;

  if (positionWindow.className === 'closed') {
    sidebar.highlightIcon('currentPosition');
  }

  updatePositionDisplay();
  updateScoutDisplay();
  populateTerritoryList();
};

Army.prototype.attack = function (territoryName) {
  var attackNote;
  attackNote = document.getElementById('Attack');
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
  var scoutsWindow;
  var sidebar;
  var troopsWindow;

  awayTurf = attacker.location;
  homeTurf = attacker.location;

  commenter = this.defineCommenterObj(commentatorNode);

  sidebar = document.getElementById('sidebar');
  scoutsWindow = document.getElementById('Scout Reports');
  troopsWindow = document.getElementById('Troops');

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

  if (troopsWindow.className === 'closed') {
    sidebar.highlightIcon('troops');
  }
  if (scoutsWindow.className === 'closed') {
    sidebar.highlightIcon('scoutReports');
  }
};

Army.prototype.infantryBattle = function (attacker, defender, commenter) {
  console.log("Infantry battle");
  console.log(attacker.isPlayer ? "Player attacking." : "AI attacking.");
  var antiArtilleryDice;
  var antiCavalryDice;
  var antiInfantryDice;
  var artilleryKills;
  var cavalryKills;
  var infantryKills;

  antiInfantryDice  = [0, 1, 1, 2, 2, 3, 4, 5, 7];
  antiCavalryDice   = [0, 0, 1, 1, 2, 2, 3, 4, 5];
  antiArtilleryDice = [0, 0, 0, 0, 0, 0, 1, 1, 2];

  infantryKills = this.rollDice(antiInfantryDice, 3, 'disadvantage');
  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /INFANTRY ATTACKING INFANTRY/
    IF:
      The attacking infantry is in line formation.
    THEN:
      The attacker can attack with only 2 dice w/ disadvantage, rather than 3.
  */
  if (attacker.infantry.formation == 'line') {
    if (infantryKills > 2 && attacker.infantry.count > 0 && defender.infantry.count > 1) {
      infantryKills = this.rollDice(antiInfantryDice, 2, 'disadvantage');
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Shooting from line formation has let our infantry release a devastating volley on the enemy's infantry." :
        "> Shooting from line formation has let their infantry release a devastating volley on our own.",
      6);
    }
  }
  console.log("Infantry's infantry kills: ", infantryKills);

  infantryKills = infantryKills < attacker.infantry.count ? infantryKills : attacker.infantry.count;

  cavalryKills = this.rollDice(antiCavalryDice, 3, 'disadvantage');
  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /INFANTRY ATTACKING CAVALRY/
    IF:
      The defending cavalry is in sabers mode.
    THEN:
      The attacker can attack with only 2 dice w/ disadvantage, rather than 3.
  */
  if (defender.cavalry.disposition == 'sabers') {
    cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
    if (cavalryKills > 1 && attacker.infantry.count > 0 && defender.cavalry.count > 1) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> The enemy cavalry's use of their sabers is making them easy targets for our infantry." :
        "> Our cavalry's use of sabers is making them easy targets for enemy infantry.",
      6);
    }
  }

  cavalryKills = cavalryKills < attacker.infantry.count ? cavalryKills : attacker.infantry.count;

  console.log("Infantry's cavalry kills: ", cavalryKills);

  artilleryKills = this.rollDice(antiArtilleryDice, 3, 'disadvantage');
  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /INFANTRY ATTACKING ARTILLERY/
    IF:
      The attacker is in line formation.
    THEN:
      The attacker can attack with only 2 dice w/ disadvantage, rather than 3.
  */
  if (attacker.infantry.formation == 'line') {
    artilleryKills = this.rollDice(antiArtilleryDice, 2, 'disadvantage');
    if (artilleryKills > 0 && attacker.infantry.count > 0 && defender.artillery.count > 0) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our infantry's wide breadth of fire is effective against their artillery." :
        "> Their infantry's wide breadth of fire is having a terrible effect against our artillery.",
      6);
    }
  }

  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /INFANTRY ATTACKING ARTILLERY/
    IF:
      The defending army has less than 6 combined cavalry and infantry protecting their artillery.
    AND:
      The attacking infantry is in bayonets formation
    THEN:
      The attacker can attack with 5 dice w/ advantage.
  */
  if (defender.infantry.count + defender.cavalry.count < 6) {
    artilleryKills = this.rollDice(antiArtilleryDice, 5, 'advantage');
    if (artilleryKills > 0 && attacker.infantry.count > 0 && defender.artillery.count > 0) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Their artillery is undefended!." :
        "> Our artillery is undefended!.",
      2);
    }
  }

  artilleryKills = artilleryKills < attacker.infantry.count ? artilleryKills : attacker.infantry.count;

  console.log("Infantry's artillery kills: ", artilleryKills);

  defender.kills.infantry += infantryKills;
  defender.kills.cavalry += cavalryKills;
  defender.kills.artillery += artilleryKills;
};

Army.prototype.cavalryBattle = function (attacker, defender, commenter) {
  console.log("Cavalry battle");
  console.log(attacker.isPlayer ? "Player attacking." : "AI attacking.");
  var antiArtilleryDice;
  var antiCavalryDice;
  var antiInfantryDice;
  var artilleryKills;
  var cavalryKills;
  var infantryKills;

  antiInfantryDice  = [0, 1, 1, 2, 2, 3, 3, 4, 5];
  antiCavalryDice   = [0, 0, 1, 1, 2, 2, 3, 4, 5];
  antiArtilleryDice = [0, 0, 0, 0, 0, 0, 1, 1, 1];

  infantryKills = this.rollDice(antiInfantryDice, 2, 'disadvantage');
  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /CAVALRY ATTACKING INFANTRY/
    IF:
      The defending infantry is in line formation.
    THEN:
      The attacker can attack with 1 dice instead of 2 with disadvantage.
  */
  if (defender.infantry.formation == 'line') {
    infantryKills = this.rollDice(antiInfantryDice, 1);
    if (infantryKills > 3 && defender.infantry.count > 0 && attacker.cavalry.count > 0) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our cavalry was able to break the enemy's infantry line." :
        "> Arraying our infantry in line formation has let their cavalry trample through our soldiers.",
        4);
    }
  }

  infantryKills = infantryKills < attacker.cavalry.count ? infantryKills : attacker.cavalry.count;

  console.log("Cavalry's infantry kills: ", infantryKills);

  cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /CAVALRY ATTACKING CAVALRY/
    IF:
      Attacker's cavalry is in sabers mode.
    THEN:
      Attacker can roll 1 dice instead of 2 with disadvantage.
  */
  if (attacker.disposition == 'sabers') {
    cavalryKills = this.rollDice(antiCavalryDice, 1);
    if (cavalryKills > 1 && attacker.cavalry.count > 0 && defender.cavalry.count > 1 && defender.cavalry.disposition == 'rifles') {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our cavalry's skilled saber use is giving them the advantage over the enemy's." :
        "> Their cavalry is butchering ours with their sabers before we can reload!",
      2);
    }
  }

  cavalryKills = cavalryKills < attacker.cavalry.count ? cavalryKills : attacker.cavalry.count;

  console.log("Cavalry's cavalry kills: ", cavalryKills);

  artilleryKills = artilleryKills < attacker.cavalry.count ? artilleryKills : attacker.cavalry.count;

  console.log("Cavalry's artillery kills: ", artilleryKills);

  defender.kills.infantry += infantryKills;
  defender.kills.cavalry += cavalryKills;
  defender.kills.artillery += artilleryKills;
};

Army.prototype.artilleryBattle = function (attacker, defender, commenter) {
  console.log("Artillery battle");
  console.log(attacker.isPlayer ? "Player attacking." : "AI attacking.");
  var antiArtilleryDice;
  var antiCavalryDice;
  var antiInfantryDice;
  var artilleryKills;
  var cavalryKills;
  var infantryKills;

  antiInfantryDice  = [0, 1, 1, 1, 2, 2, 3, 4, 6];
  antiCavalryDice   = [0, 0, 1, 1, 2, 2, 3, 3, 4];
  antiArtilleryDice = [0, 0, 0, 0, 0, 0, 1, 1, 2];

  infantryKills = this.rollDice(antiInfantryDice, 2, 'disadvantage');
  cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
  artilleryKills = this.rollDice(antiArtilleryDice, 2, 'disadvantage');

  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /ARTILLERY ATTACKING ALL/
    IF:
      Attacker's artillery is targeting a division (always in effect).
    THEN:
      Attacker can roll 2 dice with advantage against targeted division instead of 2 with disadvantage.
  */
  switch (attacker.artillery.target) {
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

  /* Battle Rules *\
  :ATTACKER ADVANTAGE:
  /ARTILLERY ATTACKING ALL/
    IF:
      Attacker has artillery.
    THEN:
      Attacker gains 3 with disadvantage against each division for every attacking artillery piece.
  */
  infantryKills += this.rollDice(antiInfantryDice, 3, 'disadvantage') * (attacker.artillery.count);
  cavalryKills += this.rollDice(antiCavalryDice, 3, 'disadvantage') * (attacker.artillery.count);
  artilleryKills += this.rollDice(antiArtilleryDice, 3, 'disadvantage') * (attacker.artillery.count);

  infantryKills = infantryKills < attacker.artillery.count * 5 ? infantryKills : attacker.artillery.count * 5;
  cavalryKills = cavalryKills < attacker.artillery.count * 4 ? cavalryKills : attacker.artillery.count * 4;
  artilleryKills = artilleryKills < attacker.artillery.count ? artilleryKills : attacker.artillery.count;

  console.log("Artillery's infantry kills: ", infantryKills);
  console.log("Artillery's cavalry kills: ", cavalryKills);
  console.log("Artillery's artillery kills: ", artilleryKills);

  if (defender.isPlayer) {
    if (infantryKills > 6 && cavalryKills > 4 && artilleryKills > 0 && (defender.infantry.count > 0 || defender.cavalry.count > 0 || defender.artillery.count > 0)) {
      commenter.say("> Their artillery is devastating our forces!");
      commenter.lineBreak();
    } else if (infantryKills > 6 && cavalryKills > 4 && defender.infantry.count > 0 && defender.cavalry.count > 0) {
      commenter.say("> Their artillery is devastating our infantry and cavalry!");
      commenter.lineBreak();
    } else if (cavalryKills > 4 && defender.cavalry.count > 0) {
      commenter.say("> Their artillery is devastating our cavalry!");
      commenter.lineBreak();
    } else if (infantryKills > 6 && defender.infantry.count > 0) {
      commenter.say("> Their artillery is devastating our infantry!");
      commenter.lineBreak();
    }
  }

  defender.kills.infantry += infantryKills;
  defender.kills.cavalry += cavalryKills;
  defender.kills.artillery += artilleryKills;
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

  if (!this.infantry.count && !this.cavalry.count && !this.artillery.count) {
    if (this.isPlayer) {
      commenter.say("> Our forces have been destroyed in the field. It's over.");
      commenter.lineBreak();
    } else if (attacker.isPlayer) {
      commenter.say("> Victory! We've destroyed the enemy's forces!");
      commenter.lineBreak();
    }
    this.destroy();
  }

  updateTroopsWindow();
  updateScoutDisplay();
  populateTerritoryList();

  clearTimeout(this.timeout);
  if (this.isPlayer) {
    this.timeout = setTimeout(function () {
      this.slowClear();
    }.bind(commenter), 7000);
  }
};

Army.prototype.defineCommenterObj = function (commentatorNode) {
  return {
    lineBreak: function () {
      if (commentatorNode) {
        commentatorNode.innerHTML += '<br>';
      }
    },

    say: function (text) {
      if (commentatorNode) {
        commentatorNode.clearing = false;
        commentatorNode.innerText += text;
      }
    },

    maybeSay: function (text, odds) {
      if (commentatorNode && (!Math.floor(Math.random() * odds))) {
        commentatorNode.clearing = false;
        commentatorNode.innerText += text;
        this.lineBreak();
      }
    },

    clear: function () {
      if (commentatorNode) {
        commentatorNode.innerText = '';
      }
    },

    slowClear: function () {
      var html;
      var interval;
      if (!commentatorNode) { return null; }
      clearInterval(interval);
      commentatorNode.clearing = true;
      interval = setInterval(function () {
        html = this.commentatorNode.innerHTML;
        if (this.commentatorNode.clearing) {
          this.commentatorNode.innerHTML = html.split('<br>').slice(1, html.split('<br>').length).join('<br>');
        }
        if (this.commentatorNode.innerHTML === '') {
          clearInterval(interval);
          this.commentatorNode.clearing = false;
        }
      }.bind({commentatorNode: commentatorNode, interval: interval}), 1000);
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
};

Army.prototype.destroy = function (destroyer) {
  var i;
  for (i=0 ; i<game.armies.length ; i++) {
    if (game.armies[i] === this) {
      this.location.flag = '';
      game.armies = game.armies.slice(0, i).concat(game.armies.slice(i+1, game.armies.length));
    }
  }
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
  game.playerArmy = new Army ('California', null, 24);
  game.playerArmy.isPlayer = true;
  game.armies.push(game.playerArmy);
};

var createCloneArmies = function () {
  var newArmy;
  if (!Math.round(Math.random())) {
    newArmy = new Army ('Utah', 'Confederate States of America', Math.round(Math.random() * 20));
  } else {
    newArmy = new Army ('Texas', 'Confederate States of America', Math.round(Math.random() * 20));
  }
  game.armies.push(newArmy);
  if (!Math.round(Math.random())) {
    newArmy = new Army ('Louisiana', 'French Empire', Math.round(Math.random() * 20));
  } else {
    newArmy = new Army ('British Columbia', 'British Empire', Math.round(Math.random() * 20));
  }
  game.armies.push(newArmy);
  if (!Math.round(Math.random())) {
    newArmy = new Army ('Manitoba', 'Coalition of Freedmen', Math.round(Math.random() * 20));
  } else {
    newArmy = new Army ('Coahuila', 'United Mexican States', Math.round(Math.random() * 20));
  }
  game.armies.push(newArmy);
  if (!Math.round(Math.random())) {
    newArmy = new Army ('New Mexico', 'United Mexican States', Math.round(Math.random() * 20));
  } else {
    newArmy = new Army ('Nevada', 'United States of America', Math.round(Math.random() * 20));
  }
  game.armies.push(newArmy);
  if (!Math.round(Math.random())) {
    newArmy = new Army ('Nunavut', 'British Empire', Math.round(Math.random() * 20));
  } else {
    newArmy = new Army ('Alaska', 'French Empire', Math.round(Math.random() * 20));
  }
  game.armies.push(newArmy);
};
