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
  // attackNote.childNodes[2].innerText = "Attacking between territories hasn't been implemented yet.";
  this.engageArmies(this, this.location.tenantAt(territoryName));
};

Army.prototype.rollDice = function (sides, num) {
  var i;
  var result;
  result = 0;
  for (i=0 ; i<sides.count ; i++) {
    result += Math.floor(Math.random() * sides);
  }
  return result;
};

Army.prototype.flipCoins = function (num) {
  return Math.floor(Math.random() * num + 1);
};

Army.prototype.engageArmies = function (attacker, defender, commentatorNode) {
  var awayTurf;
  var damageCap;
  var homeTurf;
  var i;
  awayTurf = attacker.location;
  homeTurf = attacker.location;
  if (commentatorNode) {
    commentatorNode.break = function () {
      commentatorNode.innerText += '<br>';
    }
  }
  attacker.damage = {
    infantry: 0,
    cavalry: 0,
    artillery: 0,
  }
  defender.damage = {
    infantry: 0,
    cavalry: 0,
    artillery: 0,
  }

  damageCap = 12;

  attacker.infantryBattle(attacker, defender);
  attacker.infantryBattle(defender, attacker);
  attacker.cavalryBattle(attacker, defender);
  attacker.cavalryBattle(defender, attacker);
  attacker.artilleryBattle(attacker, defender);
  attacker.artilleryBattle(defender, attacker);

  console.log(attacker.infantry.count + ' ' + attacker.cavalry.count + ' ' + attacker.artillery.count);
  console.log(defender.infantry.count + ' ' + defender.cavalry.count + ' ' + defender.artillery.count);

  console.log(attacker.damage);
  console.log(defender.damage);

  attacker.subtractTroops();
  defender.subtractTroops();
};

Army.prototype.infantryBattle = function (attacker, defender) {
  var infantryGroups;
  infantryGroups = {
    infantry: 0,
    cavalry: 0,
    artillery: 0,
  }
  infantryGroups.artillery = Math.floor(attacker.infantry.count / 3)
  infantryGroups.cavalry = Math.floor(attacker.infantry.count / 3)
  infantryGroups.infantry = Math.ceil(attacker.infantry.count / 3)

  defender.damage.infantry += attacker.flipCoins(infantryGroups.infantry);
  defender.damage.cavalry += attacker.flipCoins(infantryGroups.cavalry);
  defender.damage.artillery += attacker.flipCoins(infantryGroups.artillery);

  if (attacker.infantry.formation == 'line') {
    defender.damage.infantry = Math.ceil(defender.damage.infantry * ( 4/3 ));
    defender.damage.artillery = Math.floor(defender.damage.infantry * ( 4/3 ));
  }

  if (defender.cavalry.disposition == 'aggressive') {
    defender.damage.cavalry = Math.ceil(defender.damage.cavalry * 4/3);
  }
}

Army.prototype.cavalryBattle = function (attacker, defender) {
  defender.damage.infantry += attacker.rollDice(attacker.cavalry.count);
  switch (defender.infantry.formation) {
    case 'line':
      defender.damage.infantry = Math.ceil(defender.damage.infantry * 5/3);
      break;
    case 'column':
      defender.damage.infantry = Math.floor(defender.damage.infantry * 2/3);
      break;
    case 'square':
      defender.damage.infantry = Math.ceil(defender.damage.infantry * 2/3);
      break;
  }
  defender.damage.cavalry += attacker.rollDice(Math.ceil(attacker.cavalry.count * 1/3));
  if (attacker.cavalry.disposition == 'aggressive') {
    defender.damage.cavalry *= 2;
  }
  defender.damage.artillery += attacker.rollDice(attacker.cavalry.count);
  if (attacker.cavalry.disposition == 'aggressive') {
    defender.damage.artillery = Math.floor(defender.damage.artillery * 4/3);
  }
}

Army.prototype.artilleryBattle = function (attacker, defender) {
  defender.damage.infantry += attacker.rollDice(attacker.artillery.count * 9);
  switch (defender.infantry.formation) {
    case 'line':
      defender.damage.infantry = Math.ceil(defender.damage.infantry * 2/3);
      break;
    case 'column':
      defender.damage.infantry = Math.floor(defender.damage.infantry * 5/3);
      break;
  }
  if (attacker.artillery.target == 'infantry') {
    defender.damage.infantry = Math.floor(defender.damage.infantry * 4/3);
  }
  defender.damage.cavalry += attacker.rollDice(attacker.artillery.count * 5);
  if (attacker.artillery.target == 'cavalry') {
    defender.damage.cavalry = Math.floor(defender.damage.cavalry * 4/3);
  }
  defender.damage.artillery += attacker.rollDice(Math.floor(attacker.artillery.count * 1/3));
  if (attacker.artillery.target == 'artillery') {
    defender.damage.artillery = Math.floor(defender.damage.artillery * 4/3);
  }
}

Army.prototype.subtractTroops = function () {
  if (this.artillery.count < Math.floor(this.damage.artillery / 6)) {
    this.damage.cavalry += Math.round(this.damage.artillery * 1/3);
    this.damage.infantry += Math.round(this.damage.artillery * 1/3);
    this.damage.artillery.extinct = true;
  };
  if (this.cavalry.count < this.damage.cavalry) {
    if (!this.damage.artillery.extinct) {
      this.damage.artillery += Math.round(this.damage.artillery * 1/3);
      this.damage.infantry += Math.round(this.damage.artillery * 1/3);
    } else {
      this.damage.infantry += Math.round(this.damage.artillery * 2/3);
    }
  };
  if (this.infantry.count < this.damage.infantry) {
    this.damage.cavalry += Math.round(this.damage.artillery * 1/3);
    this.damage.infantry += Math.round(this.damage.artillery * 1/3);
  };
  this.artillery.count -= Math.floor(this.damage.artillery / 6);
  this.cavalry.count -= this.damage.cavalry;
  this.infantry.count -= this.damage.infantry;

  this.infantry.count = this.infantry.count < 0 ? 0 : this.infantry.count;
  this.cavalry.count = this.cavalry.count < 0 ? 0 : this.cavalry.count;
  this.artillery.count = this.artillery.count < 0 ? 0 : this.artillery.count;
}

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
  game.playerArmy = new Army ('Arizona', null, 1);
  game.armies.push(game.playerArmy);
};

var createCloneArmies = function () {
  var newArmy;
  game.cloneArmies = [];
  newArmy = new Army ('Utah', 'Confederate States of America', 3);
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
  newArmy = new Army ('Louisiana', 'French Empire', 5);
  game.cloneArmies.push(newArmy);
  game.armies.push(newArmy);
};
