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

battleCommentator.message = function (attackingUnit, killedUnit, number, playerAttack, attacker, defender, battlefield) {
  switch (attackingUnit.type) {
    case 'infantry':
        switch (killedUnit.type) {
          case 'infantry':
          // OUTCOME
          // INFANTRY ATTACKS INFANTRY
            switch (attackingUnit.formation) {
              case 'column':
              case 'line':
                if (number === 1) {
                  return [
                    "A " + attacker.adjective() + " bullet rips through the neck of one of " + (playerAttack ? "their" : "our") + " infantrymen.",
                    "A bullet pierces one of " + (playerAttack ? "their" : "our") + " infantry in the chest.",
                    "A " + attacker.adjective() + " bullet blasts through one of " + (playerAttack ? "their" : "our") + " infantrymen's knee.",
                  ][Math.floor(Math.random() * 3)];
                } else if (number > 0) {
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
                } else if (number > 0) {
                  return [
                    (playerAttack ? "Their" : "Our") + " men lose their nerve at the oncoming bayonet rush and turn tail." +
                    ((battlefield.biome === 'taiga' || battlefield.biome === 'arctic') ?
                    " Blood turns the snow underfoot to snow as " :
                    " Blood soaks the battlefield as ") +
                    this.number(number) + " of " + (playerAttack ? "their" : "our") + "men are stabbed and hacked to death by the rush of soldiers.",
                  ][0];
                }
                break;
              }
          // END
          //
            break;
          case 'cavalry':

          // OUTCOME
          // INFANTRY ATTACKS CAVALRY
            switch (attackingUnit.formation) {
              case 'column':
              case 'line':
                if (number === 1) {
                  return [
                    "A " + attacker.adjective() + " bullet blasts a hole in one of " + (playerAttack ? "their" : "our") + " cavalrymen just below the navel.",
                    "One of " + (playerAttack ? "their" : "our") + " horses is shot in the neck and tumbles and falls, crushing its rider beneath it.",
                    "A " + attacker.adjective() + " bullet tears through a cavalryman's leg and into his horse's heart.",
                  ][Math.floor(Math.random() * 3)];
                } else if (number > 0) {
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
                } else if (number > 0) {
                  return [
                    (playerAttack ? "Their" : "Our") + " horses are terrified in the face of the bayonet charge. Some men are thrown from their horses and those who try to continue the charge have their horses cut to pieces by the oncoming bayonets, sharing their fate shortly after."
                  ][0];
                }
                break;
              }
          // END
          //
            break;
          case 'artillery':

          // OUTCOME
          // INFANTRY ATTACKS ARTILLERY
            switch (attackingUnit.formation) {
              case 'column':
              case 'line':
                if (number === 1) {
                  return [
                    "One of " + (playerAttack ? "our" : "their") + " infantry carefully lines up his shot and strikes one of the " + defender.adjective() + " caissons in the axel, disabling the gun it carries.",
                  ][0];
                } else if (number > 0) {
                  return [
                    (playerAttack ? "Our" : "Their") + " infantry " + attackingUnit.formation + " rains across at " + (playerAttack ? "their" : "our") + " artillery, disabling " + this.number(number) + " of our guns.",
                  ][0];
                }
                break;
              case 'bayonets':
                if (number === 1) {
                  if (battlefield.biome === 'desert' || battlefield.biome === 'saltflats' || battlefield.biome === 'prairie') {
                    return "One of " + (playerAttack ? "our" : "their") + "infantrymen bayonets a " + enemy.adjective() + " artillery officer through the heart and manages to get his gun off its carriage and into the bloody dirt below.";
                  } else if (battlefield.biome === 'arctic' || battlefield.biome === 'taiga') {
                    return "One of " + (playerAttack ? "our" : "their") + "infantrymen bayonets a " + enemy.adjective() + " artillery officer through the heart and manages to get his gun off its carriage and down into the bloodstained snow.";
                  } else {
                    return "One of " + (playerAttack ? "our" : "their") + "infantrymen bayonets a " + enemy.adjective() + " artillery officer through the heart and manages to get his gun off its carriage and into the blood-soaked mud.";
                  }
                } else if (number > 0) {
                  return [
                    (playerAttack ? "Our" : "Their") + " bayonet charge takes out " + this.number(number) + " " + defender.adjective() + " artillery pieces!"
                  ][0];
                }
                break;
              }
          // END
          //
            break;
        }
      break;
    case 'cavalry':
      switch (killedUnit.type) {
        case 'infantry':

        // OUTCOME
        // CAVALRY ATTACKS INFANTRY
          switch (attackingUnit.disposition) {
            case 'rifles':
              if (number === 1) {
                return [
                  "A " + attacker.adjective() + " cavalryman snipes one of " + (playerAttack ? "their" : "our") + "infantry through the back of the head and out through the eye.",
                  "A " + attacker.adjective() + " cavalryman shoots one of " + (playerAttack ? "their" : "our") + "infantry in the gut from horseback.",
                ][Math.floor(Math.random() * 2)];
              } else if (number > 0) {
                return [
                  "The cracking of rifles joins the roar of hooves as the " + attacker.adjective() + " cavalry charge, killing " + this.number(number) + " of " + (playerAttack ? "their" : "our") + " infantrymen before they can aim and fire back.",
                ][0];
              }
              break;
            case 'sabers':
              if (number === 1) {
                return [
                  "A " + attacker.adjective() + " cavalryman charges past one of " + (playerAttack ? "their" : "our") + " infantrymen and reaches down to cut his throat with his saber as he charges.",
                  "One of " + (playerAttack ? "their" : "our") + " horsemen cleaves through an infantryman's shoulder, " +
                  ((battlefield.biome === 'taiga' || battlefield.biome === 'arctic') ?
                  "dashing his warm blood onto the snow underfoot and melting it into steam." :
                  "blood spraying from where his blade tears between the man's muscles.") +
                  ".",
                ][Math.floor(Math.random() * 2)];
              } else if (number > 0) {
                return [
                  "The " + attacker.adjective() + " cavalry " + (
                    battlefield.biome === 'desert' || 'saltflats'?
                    " kick up an enormous plume of desert dust and dirt behind them " :
                    " draw their gleaming sabers "
                  ) + "as they charge our infantry, finally clashing and knocking " + this.number(number) + " men bleeding to the ground under hoof and blade."
                ][0];
              }
              break;
            }
        // END
        //
          break;
        case 'cavalry':

        // OUTCOME
        // CAVALRY ATTACKS CAVALRY
          switch (attackingUnit.disposition) {
            case 'rifles':
              if (number === 1) {
                return [
                  "A " + defender.adjective() + " horseman is blasted from his saddle by a rifle shot from the " + attacker.adjective() + " cavalry.",
                ][0];
              } else if (number > 0) {
                return [
                  "The " + attacker.adjective() + " cavalry release a fiery volley of bullets against the charging " + defender.adjective() + " horsemen, killing " + this.number(number) + ".",
                ][0];
              }
              break;
            case 'sabers':
              if (number === 1) {
                return [
                  "Two cavalrymen lock their sabers in deadly combat, circling each other on their chargers until the " + attacker.adjective() + " man ends the deadly dance by plunging his blade through his enemy's chest where it meets the neck.",
                  "Two cavalrymen lock their sabers in deadly combat, circling each other on their chargers until the " + attacker.adjective() + " man ends the deadly dance by stabbing his enemy in the thigh and releasing a geyser of blood as the wounded man tumbles out of his saddle.",
                ][Math.floor(Math.random() * 2)];
              } else if (number > 0) {
                return [
                  (playerAttack ? "Their" : "Our") + " horses keep their resolve as the " + attacker.adjective() + " cavalry approaches, then finally they reach their target, slashing and stabbing at their enemies and killing " + this.number(number) + " of the " + defender.adjective() + " horsemen.",
                ][0];
              }
              break;
            }
        // END
        //
          break;
        case 'artillery':

        // OUTCOME
        // CAVALRY ATTACKS ARTILLERY
          switch (attackingUnit.disposition) {
            case 'rifles':
              if (number === 1) {
                return [
                  "One of " + (playerAttack ? "their" : "our") + " infantry carefully lines up his shot and strikes one of the " + defender.adjective() + " caissons in the axel, disabling the gun it carries.",
                ][0];
              } else if (number > 0) {
                return [
                  (playerAttack ? "Our" : "Their") + " cavalry line rains rifle fire across at " + (playerAttack ? "their" : "our") + " artillery, disabling " + this.number(number) + " of our guns.",
                ][Math.floor(Math.random() * 2)];
              }
              break;
            case 'sabers':
              if (number === 1) {
                return [
                  "A " + attacker.adjective() + " horseman slashes the throat of one of the " + defender.adjective() + " artillery officers and rears his horse up, kicking " + (playerAttack ? "their" : "our") + " cannon out of its housing.",
                ][0];
              } else if (number > 0) {
                return [
                  (playerAttack ? "Our" : "Their") + " cavalry charge takes out " + this.number(number) + " " + defender.adjective() + " artillery pieces!"
                ][0];
              }
              break;
            }
            // END
            //
              break;
          }
        break;
    case 'artillery':
      switch (killedUnit.type) {

        // OUTCOME
        // ARTILLERY ATTACKS INFANTRY
        case 'infantry':
          if (number === 1) {
            return [
              "A cannonball hurls down across the " + battlefield.biome + " and blasts a " + defender.adjective() + " infantryman's leg clean off.",
              "A cannonball rips across the battlefield and decapitates a " + defender.adjective() + " soldier.",
              "A cannonball rips across the battlefield and strikes a " + defender.adjective() + " infantryman in the chest, spraying pieces of him out across the " + battlefield.biome + ".",
            ][Math.floor(Math.random() * 3)];
          } else if (number <= 4 && number > 0) {
            return [
              "The thunder of guns comes exploding to life on one end of the " + battlefield.biome + " as the " + attacker.adjective() + " artillery lets a volley fly. It tears through the charging bodies of " + this.number(number) + " " + defender.adjective() + " infantry.",
            ][0];
          } else if (number > 0){
            return [
              "The thunder of guns comes exploding to life on one end of the " + battlefield.biome + " as the " + attacker.adjective() + " artillery lets a volley fly. " + (playerAttack ? "Our" : "Their") + " soaring cannonballs land and blast " + (playerAttack ? "their" : "our") + " infantry to pieces, killing " + this.number(number) + " " + defender.adjective() + " men in a terrible shower of blood and mangled extremities.",
            ][0];
          }
          break;
          // END
          //

        // OUTCOME
        // ARTILLERY ATTACKS CAVALRY
        case 'cavalry':
          if (number === 1) {
            return [
              "A cannonball hurls down across the " + battlefield.biome + " splits a " + defender.adjective() + " horse into two pieces at the midsection, mangling its rider.",
              "A cannonball rips across the battlefield and strikes a " + defender.adjective() + " horse directly in the head, crumpling it in on itself as its rider soars forward onto the battlefield and lands with a crack.",
              "A cannonball rips across the battlefield and strikes a " + defender.adjective() + " cavalryman in the shoulder, tearing his arm out of its socket and sending him plummeting off his horse.",
            ][Math.floor(Math.random() * 3)];
          } else if (number > 0) {
            return [
              attacker.adjective() + " cannonballs rain down on " + (playerAttack ? "their" : "our") + " cavalry, tearing apart " + this.number(number) + " of them.",
            ][0];
          }
          break;
          // END
          //

        // OUTCOME
        // ARTILLERY ATTACKS ARTILLERY
        case 'artillery':
          if (number === 1) {
            return [
              "A cannonball hurtles down across the " + battlefield.biome + " and drives an enormous crack down the length of a " + defender.adjective() + " gun, causing it to explode.",
            ][0];
          } else if (number > 0) {
            return [
              "The " + attacker.adjective() + " artillery rains hell on " + (playerAttack ? "their" : "our") + " guns, destroying " + this.number(number) + " of them.",
            ][0];
          }
          break;
          // END
          //
      }
      break;
  }
  return false;
};
