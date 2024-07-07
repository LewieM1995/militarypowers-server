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
      country.units.infantry * 1 * modifiers.infantry +
      country.units.navy * 1 * modifiers.navy +
      country.units.airForce * 1 * modifiers.airForce +
      country.units.technology * 1 * modifiers.technology +
      country.units.logistics * 1 * modifiers.logistics +
      country.units.intelligence * 2 * modifiers.intelligence
    );
  } catch (error) {
    console.error('Error in calculateMilitaryPower:', error);
  }
};

const calculateRemainingUnits = (initialUnits, lossPercentage, isWinner) => {
  try {
    //console.log('calculateRemainingUnits called with initialUnits:', initialUnits, 'lossPercentage:', lossPercentage, 'isWinner:', isWinner);
    const remainingUnits = {};
    const lossFactor = isWinner ? 1 - lossPercentage / 10 : 1 - lossPercentage;
    console.log("this is loss factor", lossFactor);

    for (const unit in initialUnits) {
      if (initialUnits.hasOwnProperty(unit)) {
        remainingUnits[unit] = Math.floor(initialUnits[unit] * lossFactor);
      }
    }

    return remainingUnits;
  } catch (error) {
    console.error('Error in calculateRemainingUnits:', error);
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
    //console.log('applyStalemateLossRate called with units:', units);
    const stalemateLossRate = 0.05;
    const lossUnits = {};
    for (const unit in units) {
      if (units.hasOwnProperty(unit)) {
        lossUnits[unit] = Math.floor(units[unit] * stalemateLossRate);
      }
    }
    return lossUnits;
  } catch (error) {
    console.error('Error in applyStalemateLossRate:', error);
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
      updatedNextLevelXp *= 1.5; // Assuming the XP required for the next level doubles
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

const updateConsecutiveWins = (winnerStats, isWinner) => {
  try {
    //console.log('updateConsecutiveWins called with winnerStats:', winnerStats, 'isWinner:', isWinner);
    if (isWinner){
      return winnerStats + 1;
    } else {
      winnerStats = 0;
    }
    return winnerStats;
  } catch (error) {
    console.error('Error in updateConsecutiveWins:', error);
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
    checkCriteria: (profile) => profile.profileStats.consecutiveWins >= 5,
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
  updateConsecutiveWins,
  updateHighestEnemyLevelDefeated,
  updateFirstwin,
  checkAndAwardAchievements
};
