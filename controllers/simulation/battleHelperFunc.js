const terrains = ["desert", "forest", "mountain", "plains", "urban", "sea"];
const getRandomTerrain = () => {
  try {
    //console.log('getRandomTerrain called');
    return terrains[Math.floor(Math.random() * terrains.length)];
  } catch (error) {
    console.error('Error in getRandomTerrain:', error);
  }
};

const calculateMilitaryPower = (country, terrain) => {
  try {
    //console.log('calculateMilitaryPower called with country:', country, 'terrain:', terrain);
    const terrainModifiers = {
      desert: {
        infantry: 1.0,
        navy: 0.7,
        airForce: 1.5,
        technology: 1.5,
        logistics: 1.6,
        intelligence: 1.2,
      },
      forest: {
        infantry: 1.6,
        navy: 0.7,
        airForce: 1,
        technology: 1.5,
        logistics: 1.1,
        intelligence: 1.7,
      },
      mountain: {
        infantry: 1.6,
        navy: 0.6,
        airForce: 1.4,
        technology: 1.5,
        logistics: 1.2,
        intelligence: 1.4,
      },
      plains: {
        infantry: 1.2,
        navy: 0.9,
        airForce: 1.1,
        technology: 1.5,
        logistics: 1.0,
        intelligence: 1.0,
      },
      urban: {
        infantry: 1.0,
        navy: 0.7,
        airForce: 1.0,
        technology: 1.5,
        logistics: 1.4,
        intelligence: 1.7,
      },
      sea: {
        infantry: 0.8,
        navy: 1.9,
        airForce: 1.7,
        technology: 1.5,
        logistics: 1.0,
        intelligence: 2,
      },
    };

    const modifiers = terrainModifiers[terrain];

    return (
      country.units.infantry * 0.5 * modifiers.infantry +
      country.units.navy * 0.85 * modifiers.navy +
      country.units.airForce * 1 * modifiers.airForce +
      country.units.technology * 1 * modifiers.technology +
      country.units.logistics * 0.5 * modifiers.logistics +
      country.units.intelligence * 2 * modifiers.intelligence
    );
  } catch (error) {
    console.error('Error in calculateMilitaryPower:', error);
  }
};

const calculateRemainingUnits = (initialUnits, lossPercentage, isWinner, isStalemate = false) => {
  try {
    const remainingUnits = {};

    // Adjust lossFactor based on whether it's a stalemate or a win/loss scenario
    const lossFactor = isStalemate ? 0.95 : (isWinner ? 1 - lossPercentage / 10 : 1 - lossPercentage);
    

    for (const unit in initialUnits) {
      if (initialUnits.hasOwnProperty(unit)) {
        const initialCount = initialUnits[unit];

        if (isNaN(initialCount) || initialCount < 0) {
          console.warn(`Invalid initial unit count for ${unit}:`, initialCount);
          remainingUnits[unit] = 0; // Default to 0 if the initial unit count is invalid
        } else {
          const remainingCount = Math.floor(initialCount * lossFactor);
          if (isNaN(remainingCount) || remainingCount < 0) {
            console.warn(`Invalid remaining unit count for ${unit}:`, remainingCount);
            remainingUnits[unit] = 0; // Default to 0 if the remaining unit count is invalid
          } else {
            remainingUnits[unit] = remainingCount;
          }
        }
      }
    }
    return remainingUnits;
  } catch (error) {
    console.error('Error in calculateRemainingUnits:', error);
    return {
      infantry: 0,
      navy: 0,
      airForce: 0,
      technology: 0,
      logistics: 0,
      intelligence: 0,
    };
  }
};

const calculateUnitsLost = (initialUnits, remainingUnits) => {
  try {
    //console.log('calculateUnitsLost called with initialUnits:', initialUnits, 'remainingUnits:', remainingUnits);
    const unitsLost = {};
    for (const unit in initialUnits) {
      if (initialUnits.hasOwnProperty(unit)) {
        unitsLost[unit] = initialUnits[unit] - remainingUnits[unit];
      }
    }
    return unitsLost;
  } catch (error) {
    console.error('Error in calculateUnitsLost:', error);
  }
};

const applyStalemateLossRate = (units) => {
  try {
    const stalemateLossRate = 0.05;
    const lossUnits = {};

    for (const unit in units) {
      if (units.hasOwnProperty(unit)) {
        const unitCount = units[unit];

        // Ensure the unit count is a valid number
        if (isNaN(unitCount) || unitCount < 0) {
          console.warn(`Invalid unit count for ${unit}:`, unitCount);
          lossUnits[unit] = 0; // Default to 0 if the unit count is invalid
        } else {
          lossUnits[unit] = Math.floor(unitCount * stalemateLossRate);
        }
      }
    }
    return lossUnits;
  } catch (error) {
    console.error('Error in applyStalemateLossRate:', error);
    return {
      infantry: 0,
      navy: 0,
      airForce: 0,
      technology: 0,
      logistics: 0,
      intelligence: 0,
    };
  }
};

const calculateLossPercentage = (winnerPower, loserPower) => {
  try {
    //console.log('calculateLossPercentage called with winnerPower:', winnerPower, 'loserPower:', loserPower);
    const totalPower = winnerPower + loserPower;
    const powerDifference = winnerPower - loserPower;
    return Math.abs(powerDifference) / totalPower;
  } catch (error) {
    console.error('Error in calculateLossPercentage:', error);
  }
};

const rewardWinner = (level, isWinner, enemyLevel) => {
  try {
    //console.log('rewardWinner called with level:', level, 'isWinner:', isWinner, 'enemyLevel:', enemyLevel);
    let xpGain;
    if (isWinner) {
      if (level > enemyLevel) {
        xpGain = (level + enemyLevel) * 100; // Example calculation for XP gain
        return xpGain;
      } else {
        xpGain = (level + enemyLevel) * 2 * 100;
        return xpGain;
      }
    }
    return 0;
  } catch (error) {
    console.error('Error in rewardWinner:', error);
  }
};

const calculateBudgetIncrease = (winnerLevel, enemyLevel, initValue) => {
  try {
    //console.log('calculateBudgetIncrease called with winnerLevel:', winnerLevel, 'enemyLevel:', enemyLevel, 'initValue:', initValue);
    let levelFactor;

    if (winnerLevel > enemyLevel) {
      levelFactor = (winnerLevel + enemyLevel) / 2; // Example calculation based on the winner's level
    } else {
      levelFactor = ((winnerLevel + enemyLevel) * 2) / 2.5; // Example calculation based on the winner's and enemy's levels
    }

    const budgetIncrease = initValue * levelFactor;
    return budgetIncrease;
  } catch (error) {
    console.error('Error in calculateBudgetIncrease:', error);
  }
};

const updateProfileBudget = (profile, budgetIncrease) => {
  try {
    //console.log('updateProfileBudget called with profile:', profile, 'budgetIncrease:', budgetIncrease);

    // Convert the budget to a number before performing arithmetic operations
    profile.budget = parseFloat(profile.budget) + budgetIncrease;

    // Ensure the budget is a string formatted to two decimal places
    profile.budget = profile.budget.toFixed(2);

    return profile;
  } catch (error) {
    console.error('Error in updateProfileBudget:', error);
  }
};

const updateProfileXpAndLevel = (profile, xpGain) => {
  try {
    //console.log('updateProfileXpAndLevel called with profile:', profile, 'xpGain:', xpGain);
    const { level, xp, nextLevelXp } = profile.profileStats;
    let updatedXp = xp + xpGain;
    let updatedLevel = level;
    let updatedNextLevelXp = nextLevelXp;

    while (updatedXp >= updatedNextLevelXp) {
      updatedXp -= updatedNextLevelXp;
      updatedLevel += 1;
      updatedNextLevelXp *= 1.3;
    }

    const updatedProfileStats = {
      ...profile.profileStats,
      level: updatedLevel,
      xp: updatedXp,
      nextLevelXp: updatedNextLevelXp,
    };

    return {
      ...profile,
      profileStats: updatedProfileStats,
    };
  } catch (error) {
    console.error('Error in updateProfileXpAndLevel:', error);
  }
};

const updateBattleStats = (winnerStats, isWinner) => {
  try {
    //console.log('updateBattleStats called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      return winnerStats + 1;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateBattleStats:', error);
  }
};

const updateTotalWins = (winnerStats, isWinner) => {
  try {
    //console.log('updateConsecutiveWins called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      return winnerStats + 1;
    } 
    return winnerStats;
  } catch (error) {
    console.error('Error in updateTotalWins:', error);
  }
};

const updateTotalLosses = (winnerStats, isWinner) => {
  try {
    if (!isWinner){
      return winnerStats + 1;
    } 
    return winnerStats;
  } catch (error) {
    console.error('Error in updateTotalLosses:', error);
  }
};

const updateHighestEnemyLevelDefeated = (winnerStats, enemyLevel, isWinner) => {
  try {
    //console.log('updateHighestEnemyLevelDefeated called with winnerStats:', winnerStats, 'enemyLevel:', enemyLevel, 'isWinner:', isWinner);
    if (isWinner){
      winnerStats = enemyLevel;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateHighestEnemyLevelDefeated:', error);
  }
};

const updateFirstwin= (winnerStats, isWinner) => {
  try {
    //console.log('updateFirstwin called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      winnerStats = true;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateFirstwin:', error);
  }
};

const checkAndAwardAchievements = (playerProfile, enemyLevel) => {
  try {
    //console.log('checkAndAwardAchievements called with playerProfile:', playerProfile, 'enemyLevel:', enemyLevel);
    if (!Array.isArray(playerProfile.profileStats.achievements)) {
      playerProfile.profileStats.achievements = [];
    }

    achievementCriteria.forEach((achievement) => {
      if (
        achievement.checkCriteria(playerProfile, enemyLevel) &&
        !playerProfile.profileStats.achievements.some((ach) => ach.id === achievement.id)
      ) {
        playerProfile.profileStats.achievements.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
        });
        //console.log(`${playerProfile.name} earned the "${achievement.name}" achievement!`);
      }
    });
  } catch (error) {
    console.error('Error in checkAndAwardAchievements:', error);
  }
};

const achievementCriteria = [
  {
    id: 1,
    name: 'First Victory',
    description: 'Win your first battle',
    checkCriteria: (profile) => profile.profileStats.firstVictory,
    icon: null
  },
  {
    id: 2,
    name: 'Unstoppable',
    description: 'Win 5 battles in a row',
    checkCriteria: (profile) => profile.profileStats.total_wins >= 5,
    icon: null
  },
  {
    id: 3,
    name: 'Master Strategist',
    description: 'Reach level 10',
    checkCriteria: (profile) => profile.profileStats.level >= 10,
    icon: null
  },
  {
    id: 4,
    name: 'Legendary Warrior',
    description: 'Defeat a level 10 opponent',
    checkCriteria: (profile, enemyLevel) => profile.profileStats.highestEnemyLevelDefeated >= 10,
    icon: null
  },
];

module.exports = {
  getRandomTerrain,
  calculateMilitaryPower,
  calculateRemainingUnits,
  calculateUnitsLost,
  applyStalemateLossRate,
  calculateLossPercentage,
  rewardWinner,
  calculateBudgetIncrease,
  updateProfileBudget,
  updateProfileXpAndLevel,
  updateBattleStats,
  updateTotalWins,
  updateTotalLosses,
  updateHighestEnemyLevelDefeated,
  updateFirstwin,
  checkAndAwardAchievements
};
