battleCommentator = {};

battleCommentator.number = function (number) {
  switch (number) {
    case 1: return "one";
    case 2: return "two";
    case 3: return "three";
    case 4: return "four";
    case 5: return "five";
    case 6: return "six";
    case 7: return "seven";
    case 8: return "eight";
    case 9: return "nine";
    case 10: return "ten";
    case 11: return "eleven";
    case 12: return "twelve";
    case 13: return "thirteen";
    case 20: return "twenty";
    case 30: return "thirty";
    case 40: return "forty";
    case 50: return "fifty";
    case 60: return "sixty";
    case 70: return "seventy";
    case 80: return "eighty";
    case 90: return "ninety";
    case 100: return "a hundred";
    default: return number;
  }
};

battleCommentator.capitalize = function (string) {
  return string[0].toUpperCase() + string.slice(1, string.length);
};

battleCommentator.battleMessage = function (attackingUnit, killedUnit, number, playerAttack, attacker, defender, battlefield) {
  switch (attackingUnit.type) {
    case 'infantry':
        switch (killedUnit.type) {
          case 'infantry':

          // OUTCOME
          // INFANTRY ATTACKS INFANTRY
            switch (attackingUnit.formation) {
              case 'column' || 'line':
                if (number === 1) {
                  return [
                    "A " + attacker.adjective() + " bullet rips through the neck of one of " + (playerAttack ? "their" : "our") + " infantrymen.",
                    "A bullet pierces one of " + (playerAttack ? "their" : "our") + " infantry in the chest.",
                    "A " + attacker.adjective() + " bullet blasts through one of " + (playerAttack ? "their" : "our") + " infantrymen's knee.",
                  ][Math.floor(Math.random() * 3)];
                } else {
                  return [
                    "A wide volley of rifle fire roars across the battlefield from the " + attacker.adjective() + " infantry " + attackingUnit.formation + " and kills " + this.number(number) + " of " + (playerAttack ? "their" : "our") + " men.",
                    this.capitalize(this.number(number)) + " of " + (playerAttack ? "their" : "our") + " men are killed in a " + attacker.adjective() + " infantry volley.",
                  ][Math.floor(Math.random() * 2)];
                }
                break;
              case 'bayonets':
                if (number === 1) {
                  return [
                    "One " + (playerAttack ? "their" : "our") + " men gets a bayonet shoved into his intestines.",
                    "One of " + (playerAttack ? "their" : "our") + " infantry is stuck in the thigh with a bayonet and blood starts spraying from the wound.",
                    "A " + attacker.adjective() + " bayonet slashes one of " + (playerAttack ? "their" : "our") + " infantry across the throat.",
                  ][Math.floor(Math.random() * 3)];
                } else {
                  return [
                    (playerAttack ? "Their" : "Our") + " men lose their nerve at the oncoming bayonet rush and turn tail." +
                    ((battlefield.biome === 'taiga' || battlefield.biome === 'arctic') ?
                    " Blood turns the snow underfoot to snow as " :
                    " Blood soaks the battlefield as ") +
                    this.number(number) + " of " + (playerAttack ? "their" : "our") + "men are stabbed and hacked to death by the rush of soldiers.",
                  ][0];
                }
                break;
          // END
          //
            break;
          case 'cavalry':

          // OUTCOME
          // INFANTRY ATTACKS CAVALRY
            switch (attackingUnit.formation) {
              case 'column' || 'line':
                if (number === 1) {
                  return [
                    "A " + attacker.adjective() + " bullet blasts a hole in one of " + (playerAttack ? "their" : "our") + " cavalrymen just below the navel.",
                    "One of " + (playerAttack ? "their" : "our") + " horses is shot in the neck and tumbles and falls, crushing its rider beneath it.",
                    "A " + attacker.adjective() + " bullet tears through a cavalryman's leg and into his horse's heart.",
                  ][Math.floor(Math.random() * 3)];
                } else {
                  return [
                    "A wide volley of rifle fire roars across the battlefield from the " + attacker.adjective() + " infantry " + attackingUnit.formation + " and kills " + this.number(number) + " of " + (playerAttack ? "their" : "our") + " cavalry.",
                    "Men topple from their steeds and horses crumble to the ground in heaps as the " + attacker.adjective() + " infantry volley strikes " + (playerAttack ? "their" : "our") + " charging cavalry, killing " + this.number(number) + ".",
                  ][Math.floor(Math.random() * 2)];
                }
                break;
              case 'bayonets':
                if (number === 1) {
                  return [
                    "One of " + (playerAttack ? "their" : "our") + " men dives at an enemy horse and shoves his bayonet up into its chest, pulling its rider to the ground and stabbing him in the neck.",
                  ][0];
                } else {
                  return [
                    (playerAttack ? "Their" : "Our") + " horses are terrified in the face of the bayonet charge. Some men are thrown from their horses and those who try to continue the charge have their horses cut to pieces by the oncoming bayonets, sharing their fate shortly after."
                  ][0];
                }
                break;
          // END
          //
            break;
          case 'artillery':

          // OUTCOME
          // INFANTRY ATTACKS ARTILLERY
            switch (attackingUnit.formation) {
              case 'column' || 'line':
                if (number === 1) {
                  return [
                    "One of " + (playerAttack ? "their" : "our") + " infantry carefully lines up his shot and strikes one of the " + defender.adjective() + " caissons in the axel, disabling the gun it carries.",
                  ][0];
                } else {
                  return [
                    (playerAttack ? "Their" : "Our") + " infantry " + attacker.formation + " rains across at our artillery, disabling " + this.number(number) + " of our guns.",
                  ][Math.floor(Math.random() * 2)];
                }
                break;
              case 'bayonets':
                if (number === 1) {
                  return [
                  ][0];
                } else {
                  return [
                  ][0];
                }
                break;
          // END
          //
            break;
        }
      break;
    case 'cavalry':
      //
      break;
    case 'artillery':
      //
      break;
  }
};
