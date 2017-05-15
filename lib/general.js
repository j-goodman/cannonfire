var General = function (object) {
  this.army = object.army;
};

General.prototype.act = function () {
  var attacks;
  var i;
  var points;
  var target;
  var territory;
  var territories;
  // console.log('');
  // console.log('General reporting for the army of the ' + this.army.flag + '.');

  // FIRST,
  // Check for reserves in the current territory, recruit any you find.
  // console.log("Infantry count and reserves: ", this.army.infantry.count, this.army.location.reserves.infantry);
  this.army.infantry.count += this.army.location.reserves.infantry;
  this.army.location.reserves.infantry = 0;
  // console.log("Infantry count and reserves: ", this.army.infantry.count, this.army.location.reserves.infantry);
  this.army.cavalry.count += this.army.location.reserves.cavalry;
  this.army.location.reserves.cavalry = 0;
  this.army.artillery.count += this.army.location.reserves.artillery;
  this.army.location.reserves.artillery = 0;

  // SECOND,
  // Check your borders and organize the adjacent territories by type.
  territories = {
    withEnemyArmies: [],
    withDefeatableArmies: [],
    undefendedEnemy: [],
    undefendedLoyal: [],
    undefendedUndeclared: [],
    all: [],
  };
  for (i=0 ; i<this.army.location.borderNames.length ; i++) {
    territory = MAP[this.army.location.borderNames[i]];
    if (territory.flag && territory.flag !== this.army.flag) {
      territories.withEnemyArmies.push(territory);
    }
    if (territory.flag === '' && territory.loyalTo && territory.loyalTo !== this.army.flag) {
      territories.undefendedEnemy.push(territory);
    }
    if (territory.flag === '' && territory.loyalTo === this.army.flag) {
      territories.undefendedLoyal.push(territory);
    }
    if (territory.loyalTo === '') {
      territories.undefendedUndeclared.push(territory);
    }
    territories.all.push(territory);
  }
  // console.log("Territories: ", territories);

  // THIRD,
  // Determine which adjacent enemy armies might be defeated if engaged.
  for (i=0 ; i<territories.withEnemyArmies.length ; i++) {
    points = 0;
    if (territories.withEnemyArmies[i].tenantAt()) {
      points += this.army.infantry.count > territories.withEnemyArmies[i].tenantAt().infantry.count ? 1 : 0;
      points += this.army.cavalry.count > territories.withEnemyArmies[i].tenantAt().cavalry.count ? 1 : 0;
      points += this.army.artillery.count > territories.withEnemyArmies[i].tenantAt().artillery.count ? 1 : 0;
    } else {
      // console.log("NO TENANT AT " + territories.withEnemyArmies[i].name.toUpperCase());
    }
    if (points >= 2) {
      territories.withDefeatableArmies.push(territories.withEnemyArmies[i]);
    }
  }
  // console.log("Defeatable armies: ", territories.withDefeatableArmies);

  // FOURTH,
  // If there is a defeatable army bordering you, 75/25 attack it.
  if (territories.withDefeatableArmies.length && Math.random() * 100 > 25) {
    target = territories.withDefeatableArmies[Math.floor(Math.random() * territories.withDefeatableArmies.length)];
    // console.log("Attacking.");
    if (target.tenantAt().isPlayer) {
      openWindow("Attack");
      document.getElementById('attack-prompt').innerText = "We're under attack from " + this.army.location.name + "!";
      setTimeout(function () {
        document.getElementById('attack-prompt').innerText = "Which adjacent territory do you want to attack?";
      }, 5200);
    }
    attacks += 1;
    this.army.attack(target.name);
    this.endTurn();
    return null;
  }

  // FIFTH
  // If there is an unoccupied enemy-loyal territory bordering you, 75/25 invade it.
  if (territories.undefendedEnemy.length && Math.random() * 100 > 25) {
    target = territories.undefendedEnemy[Math.floor(Math.random() * territories.undefendedEnemy.length)];
    this.army.marchTo(target.name);
    // console.log("Marching into enemy-loyal territory " + target.name);
    this.endTurn();
    return null;
  }

  // SIXTH
  // If there is an unoccupied loyal territory bordering you, 50/50 move into it.
  if (territories.undefendedLoyal.length && Math.random() * 100 > 50) {
    target = territories.undefendedLoyal[Math.floor(Math.random() * territories.undefendedLoyal.length)];
    this.army.marchTo(target.name);
    // console.log("Marching into loyal territory " + target.name);
    this.endTurn();
    return null;
  }

  // SEVENTH
  // If there is an unoccupied neutral territory bordering you, move into it.
  if (territories.undefendedUndeclared.length && Math.random() * 100 > 50) {
    target = territories.undefendedUndeclared[Math.floor(Math.random() * territories.undefendedUndeclared.length)];
    // console.log("Marching into neutral territory " + target.name);
    this.army.marchTo(target.name);
    this.endTurn();
    return null;
  }

  this.endTurn();
};

General.prototype.endTurn = function () {
  // console.log('Ending turn.');
  // console.log('');
};
