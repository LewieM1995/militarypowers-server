const terrains = ["desert", "forest", "mountain", "plains", "urban", "sea"];
const getRandomTerrain = () => {
  return terrains[Math.floor(Math.random() * terrains.length)];
};

const calculateMilitaryPower = (country, terrain) => {
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
};

const calculateRemainingUnits = (initialUnits, lossPercentage, isWinner) => {
  const remainingUnits = {};
  const lossFactor = isWinner ? 1 - lossPercentage / 10 : 1 - lossPercentage;
  console.log("this is loss factor", lossFactor);

  for (const unit in initialUnits) {
    if (initialUnits.hasOwnProperty(unit)) {
      remainingUnits[unit] = Math.floor(initialUnits[unit] * lossFactor);
    }
  }

  return remainingUnits;
};

const calculateUnitsLost = (initialUnits, remainingUnits) => {
  const unitsLost = {};
  for (const unit in initialUnits) {
    if (initialUnits.hasOwnProperty(unit)) {
      unitsLost[unit] = initialUnits[unit] - remainingUnits[unit];
    }
  }
  return unitsLost;
};

const applyStalemateLossRate = (units) => {
  const stalemateLossRate = 0.05;
  const lossUnits = {};
  for (const unit in units) {
    if (units.hasOwnProperty(unit)) {
      lossUnits[unit] = Math.floor(units[unit] * stalemateLossRate);
    }
  }
  return lossUnits;
};

const calculateLossPercentage = (winnerPower, loserPower) => {
  const totalPower = winnerPower + loserPower;
  const powerDifference = winnerPower - loserPower;
  return Math.abs(powerDifference) / totalPower;
};

const updateDOMWithResults = (
  winner,
  loser,
  terrain,
  countryOneTotalPower,
  enemyProfileTotalPower,
  countryOneUnitsLost,
  enemyProfileUnitsLost,
  countryOneRemainingUnits,
  enemyProfileRemainingUnits,
  winnerStats
) => {
  const winnerElement = document.getElementById("winner");
  winnerElement.textContent = winner;
  const loserElement = document.getElementById("loser");
  loserElement.textContent = loser;
  const terrainElement = document.getElementById("terrain");
  terrainElement.textContent = terrain;
  const powerElement = document.getElementById("countryOnePower");
  powerElement.textContent = countryOneTotalPower;
  const powerTElement = document.getElementById("enemyProfilePower");
  powerTElement.textContent = enemyProfileTotalPower;
  const lostElement = document.getElementById("countryOneUnitsLost");
  lostElement.textContent = JSON.stringify(countryOneUnitsLost, null, 2);
  const lostTElement = document.getElementById("enemyProfileUnitsLost");
  lostTElement.textContent = JSON.stringify(enemyProfileUnitsLost, null, 2);
  const leftElement = document.getElementById("countryOneRemainingUnits");
  leftElement.textContent = JSON.stringify(countryOneRemainingUnits, null, 2);
  const leftTElement = document.getElementById("enemyProfileRemainingUnits");
  leftTElement.textContent = JSON.stringify(enemyProfileRemainingUnits, null, 2);
  const winnerRewardsElement = document.getElementById("winnerStats");
  winnerRewardsElement.textContent = JSON.stringify(winnerStats, null, 2);
};

const rewardWinner = (level, isWinner, enemyLevel) => {
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
};

const calculateBudgetIncrease = (winnerLevel, enemyLevel, initValue) => {
  let levelFactor;

  if (winnerLevel > enemyLevel) {
    levelFactor = (winnerLevel + enemyLevel) / 2; // Example calculation based on the winner's level
  } else {
    levelFactor = ((winnerLevel + enemyLevel) * 2) / 2.5; // Example calculation based on the winner's and enemy's levels
  }

  const budgetIncrease = initValue * levelFactor;
  return budgetIncrease;
};

const updateProfileBudget = (profile, budgetIncrease) => {
  profile.budget += budgetIncrease;
  return profile;
};

const updateProfileXpAndLevel = (profile, xpGain) => {
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
};

const updateBattleStats = (winnerStats, isWinner) => {
  if (isWinner){
    return winnerStats + 1
  }
  return winnerStats;
};

const updateConsecutiveWins = (winnerStats, isWinner) => {
  if (isWinner){
    return winnerStats + 1;
  } else {
    winnerStats = 0;
  }
  return winnerStats;
};

const updateHighestEnemyLevelDefeated = (winnerStats, enemyLevel, isWinner) => {
  if (isWinner){
    winnerStats = enemyLevel;
  }
  return winnerStats;
};

const updateFirstwin= (winnerStats, isWinner) => {
  if (isWinner){
    winnerStats = true;
  }
  return winnerStats;
};

const checkAndAwardAchievements = (playerProfile, enemyLevel) => {
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
      console.log(`${playerProfile.name} earned the "${achievement.name}" achievement!`);
    }
  });
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