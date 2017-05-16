var Army = function (locationName, flag, strength, isPlayer) {
  this.location = MAP[locationName];
  this.flag = flag;
  this.location.flag = this.flag;
  this.location.loyalTo = this.flag;
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
  this.isPlayer = isPlayer ? true : false;
  if (!this.isPlayer) {
    this.general = new General ({
      army: this,
    });
  }
};

Army.prototype.marchTo = function (territoryName) {
  var sidebar;
  var positionWindow;

  if (game.mapDrawer.animating) {
    return false;
  }

  sidebar = document.getElementById('sidebar');
  positionWindow = document.getElementById('Current Position');
  this.location.flag = '';

  if (MAP[territoryName].flag) {
    return false;
  }

  this.location = MAP[territoryName];
  this.location.flag = this.flag;

  if (positionWindow.className === 'closed') {
    sidebar.highlightIcon('currentPosition');
  }

  if (this.isPlayer) {
    game.manageRound();
  }
};

Army.prototype.attack = function (territoryName) {
  var attackNote;
  console.log(this.flag, 'attacking', this.location.tenantAt(territoryName).flag, 'at', territoryName);
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
  // console.log('ENGAGING ARMIES!');
  // console.log(attacker, defender);
  var awayTurf;
  var casualtiesAttacker;
  var casualtiesDefender;
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

  casualtiesAttacker = attacker.subtractTroops(defender, commenter);
  casualtiesDefender = defender.subtractTroops(attacker, commenter);

  if (troopsWindow.className === 'closed') {
    sidebar.highlightIcon('troops');
  }
  if (scoutsWindow.className === 'closed') {
    sidebar.highlightIcon('scoutReports');
  }

  if (
    !casualtiesAttacker && !casualtiesDefender &&
    (attacker.infantry.count || attacker.cavalry.count || attacker.artillery.count) &&
    (defender.infantry.count || defender.cavalry.count || defender.artillery.count)
  ) {
    this.engageArmies(attacker, defender, commentatorNode);
  }
};

Army.prototype.infantryBattle = function (attacker, defender, commenter) {
  // console.log("Infantry battle");
  // console.log(attacker.isPlayer ? "Player attacking." : "AI attacking.");
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
  :WIDE LINE OF FIRE:
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
  /* Battle Rules *\
  :INFANTRY MELEE DISADVANTAGE:
  /INFANTRY ATTACKING INFANTRY/
    IF:
      The attacking infantry is in bayonets formation.
    THEN:
      The attacker has to attack with 6 dice w/ disadvantage, rather than 3.
  */
  if (attacker.infantry.formation == 'bayonets') {
    if (infantryKills === 0 && attacker.infantry.count > 0 && defender.infantry.count > 2) {
      infantryKills = this.rollDice(antiInfantryDice, 6, 'disadvantage');
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our infantry's fixed bayonets are having no effect on the enemy." :
        "> Shooting from line formation has let their infantry release a devastating volley on our own.",
      6);
    }
  }
  // console.log("Infantry's infantry kills: ", infantryKills);

  infantryKills = infantryKills < attacker.infantry.count ? infantryKills : attacker.infantry.count;

  cavalryKills = this.rollDice(antiCavalryDice, 3, 'disadvantage');
  /* Battle Rules *\
  :CAVALRY MELEE DISADVANTAGE:
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

  // console.log("Infantry's cavalry kills: ", cavalryKills);

  artilleryKills = this.rollDice(antiArtilleryDice, 3, 'disadvantage');
  /* Battle Rules *\
  :WIDE FIRE AGAINST ARTILLERY:
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
      5);
    }
  }

  /* Battle Rules *\
  :BAYONET RAID ON CANNONS:
  /INFANTRY ATTACKING ARTILLERY/
    IF:
      The combined cavalry and infantry of the defender is less than twice their artillery.
    AND:
      The attacking infantry is in bayonets formation
    THEN:
      The attacker can attack with 5 dice w/ advantage.
  */
  if (defender.infantry.count + defender.cavalry.count < defender.artillery.count * 2 && attacker.infantry.formation == 'bayonets') {
    artilleryKills = this.rollDice(antiArtilleryDice, 5, 'advantage');
    if (artilleryKills > 0 && attacker.infantry.count > 0 && defender.artillery.count > 0) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Their artillery is undefended! Our bayonet charge was ruthlessly effective!" :
        "> They've made a ruthlessly effective bayonet charge against our undefended artillery!",
      2);
    }
  }
  if (defender.infantry.count + defender.cavalry.count < defender.artillery.count * 2 && (attacker.infantry.formation == 'column' || attacker.infantry.formation == 'line')) {
    if (attacker.infantry.count > 2 && defender.artillery.count > 0 && attacker.isPlayer) {
      commenter.maybeSay(
        "> Their artillery is undefended! Now's the time to fix bayonets and charge!",
      5);
    }
  }

  artilleryKills = artilleryKills < attacker.infantry.count ? artilleryKills : attacker.infantry.count;

  // console.log("Infantry's artillery kills: ", artilleryKills);

  defender.kills.infantry += infantryKills;
  defender.kills.cavalry += cavalryKills;
  defender.kills.artillery += artilleryKills;
};

Army.prototype.cavalryBattle = function (attacker, defender, commenter) {
  // console.log("Cavalry battle");
  // console.log(attacker.isPlayer ? "Player attacking." : "AI attacking.");
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
  :LINE FORMATION TRAMPLING:
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
        "> Our cavalry is breaking the enemy's infantry line!" :
        "> Our infantry line is being trampled by their cavalry!",
        3);
    }
  }

  infantryKills = infantryKills < attacker.cavalry.count ? infantryKills : attacker.cavalry.count;

  // console.log("Cavalry's infantry kills: ", infantryKills);

  cavalryKills = this.rollDice(antiCavalryDice, 2, 'disadvantage');
  /* Battle Rules *\
  :SABERS AGAINST CAVALRY:
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

  // console.log("Cavalry's cavalry kills: ", cavalryKills);

  artilleryKills = this.rollDice(antiArtilleryDice, 2, 'disadvantage');
  /* Battle Rules *\
  :CAVALRY CHARGE AGAINST ARTILLERY:
  /CAVALRY ATTACKING ARTILLERY/
    IF:
      Defender has fewer than two infantry per artillery piece.
    THEN:
      Attacker can roll 1 dice instead of 2 with disadvantage.
  */
  if (defender.infantry.count < defender.artillery.count * 2) {
    artilleryKills = this.rollDice(antiArtilleryDice, 1);
    if (artilleryKills > 0 && attacker.cavalry.count > 0 && defender.artillery.count > 1) {
      commenter.maybeSay(
        attacker.isPlayer ?
        "> Our cavalry is destroying their weakly defended artillery!" :
        "> We need more infantry to protect our cannons from their cavalry!",
      2);
    }
  }


  artilleryKills = artilleryKills < attacker.cavalry.count ? artilleryKills : attacker.cavalry.count;

  // console.log("Cavalry's artillery kills: ", artilleryKills);

  defender.kills.infantry += infantryKills;
  defender.kills.cavalry += cavalryKills;
  defender.kills.artillery += artilleryKills;
};

Army.prototype.artilleryBattle = function (attacker, defender, commenter) {
  // console.log("Artillery battle");
  // console.log(attacker.isPlayer ? "Player attacking." : "AI attacking.");
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
  :PRECISE ARTILLERY FIRING:
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
      artilleryKills = this.rollDice(antiArtilleryDice, 3, 'advantage');
      break;
  }

  /* Battle Rules *\
  :BARRAGE EN MASSE:
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

  // console.log("Artillery's infantry kills: ", infantryKills);
  // console.log("Artillery's cavalry kills: ", cavalryKills);
  // console.log("Artillery's artillery kills: ", artilleryKills);

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
  var casualties;

  this.kills.infantry = this.kills.infantry < this.infantry.count ? this.kills.infantry : this.infantry.count;
  this.kills.cavalry = this.kills.cavalry < this.cavalry.count ? this.kills.cavalry : this.cavalry.count;
  this.kills.artillery = this.kills.artillery < this.artillery.count ? this.kills.artillery : this.artillery.count;

  casualties = this.kills.infantry || this.kills.cavalry || this.kills.artillery;

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
      console.log(game.armies);
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

  return casualties;
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
      }.bind({commentatorNode: commentatorNode, interval: interval}), 2500);
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
      game.mapDrawer.drawMap(vectorMap, game.playerArmy);
    }
  }
  if (this.isPlayer) {
    setTimeout(function () {
      window.location = './game-over.html';
    }, 4000);
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

Army.prototype.color = function () {
  switch (this.flag) {
    case "French Empire":
      return '#e0e030';
    case "Confederate States of America":
      return '#405050';
    case "British Empire":
      return '#d02000';
    case "Coalition of Freedmen":
      return '#809010';
    case "United Mexican States":
      return '#20a000';
    case "United States of America":
      return '#0030c0';
  }
};

Army.prototype.lineColor = function () {
  switch (this.flag) {
    case "French Empire":
      return '#c4c480';
    case "Confederate States of America":
      return '#a7b0b0';
    case "British Empire":
      return '#f06070';
    case "Coalition of Freedmen":
      return '#b0b050';
    case "United Mexican States":
      return '#40c050';
    case "United States of America":
      return '#7090f0';
  }
};

var removeFromSpawnables = function (index) {
  game.spawnTerritories = game.spawnTerritories.slice(
    0, index
  ).concat(
    game.spawnTerritories.slice(
      index + 1, game.spawnTerritories.length
    )
  );
};

var createPlayerArmy = function () {
  var i;
  var random;
  game.armies = [];
  game.spawnTerritories = Object.keys(MAP);
  random = Math.floor(Math.random() * game.spawnTerritories.length);
  game.playerArmy = new Army (game.spawnTerritories[random], null, 7, true);
  removeFromSpawnables(random);
  for (i=0 ; i<game.playerArmy.location.borderNames.length ; i++) {
    random = game.spawnTerritories.indexOf(
      game.playerArmy.location.borderNames[i]
    );
    removeFromSpawnables(random);
  }
  game.playerArmy.isPlayer = true;
  game.armies.push(game.playerArmy);
};

var createCloneArmies = function () {
  var flags;
  var i;
  var newArmy;
  var randomFlag;

  flags = [
    'British Empire',
    'Coalition of Freedmen',
    'Confederate States of America',
    'French Empire',
    'United Mexican States',
    'United States of America'
  ];

  randomFlag = function () {
    var flag;
    flag = flags[Math.floor(Math.random() * flags.length)];
    while (flag === game.playerArmy.flag) {
      flag = flags[Math.floor(Math.random() * flags.length)];
    }
    return flag;
  };

  for (i=0 ; i<16 ; i++) {
    random = Math.floor(Math.random() * game.spawnTerritories.length);
    newArmy = new Army (game.spawnTerritories[random], randomFlag(), 2 + Math.round(Math.random() * 13));
    game.spawnTerritories = game.spawnTerritories.slice(
      0, 2 - 1
    ).concat(
      game.spawnTerritories.slice(
        2, game.spawnTerritories.length
      )
    );
    game.armies.push(newArmy);
  }
  console.log(game.armies);
};
