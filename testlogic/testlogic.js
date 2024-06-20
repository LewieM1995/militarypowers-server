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
  countryTwoTotalPower,
  countryOneUnitsLost,
  countryTwoUnitsLost,
  countryOneRemainingUnits,
  countryTwoRemainingUnits,
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
  const powerTElement = document.getElementById("countryTwoPower");
  powerTElement.textContent = countryTwoTotalPower;
  const lostElement = document.getElementById("countryOneUnitsLost");
  lostElement.textContent = JSON.stringify(countryOneUnitsLost, null, 2);
  const lostTElement = document.getElementById("countryTwoUnitsLost");
  lostTElement.textContent = JSON.stringify(countryTwoUnitsLost, null, 2);
  const leftElement = document.getElementById("countryOneRemainingUnits");
  leftElement.textContent = JSON.stringify(countryOneRemainingUnits, null, 2);
  const leftTElement = document.getElementById("countryTwoRemainingUnits");
  leftTElement.textContent = JSON.stringify(countryTwoRemainingUnits, null, 2);
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

const simulateWar = (countryOne, countryTwo, terrain) => {
  const countryOneTotalPower = calculateMilitaryPower(countryOne, terrain);
  const countryTwoTotalPower = calculateMilitaryPower(countryTwo, terrain);

  const isCountryOneWinner = countryOneTotalPower > countryTwoTotalPower;
  const isCountryTwoWinner = countryTwoTotalPower > countryOneTotalPower;

  const lossPercentage = calculateLossPercentage(
    isCountryOneWinner ? countryOneTotalPower : countryTwoTotalPower,
    isCountryOneWinner ? countryTwoTotalPower : countryOneTotalPower
  );

  const countryOneRemainingUnits = calculateRemainingUnits(
    countryOne.units,
    lossPercentage,
    isCountryOneWinner
  );
  const countryTwoRemainingUnits = calculateRemainingUnits(
    countryTwo.units,
    lossPercentage,
    isCountryTwoWinner
  );

  const countryOneUnitsLost = calculateUnitsLost(
    countryOne.units,
    countryOneRemainingUnits
  );
  const countryTwoUnitsLost = calculateUnitsLost(
    countryTwo.units,
    countryTwoRemainingUnits
  );

  const totalPower = countryOneTotalPower + countryTwoTotalPower;
  const powerDifference = Math.abs(countryOneTotalPower - countryTwoTotalPower);
  const stalemateThreshold = 0.015;

  const isStalemate = powerDifference < stalemateThreshold * totalPower;

  return {
    isStalemate,
    countryOneTotalPower,
    countryTwoTotalPower,
    countryOneUnitsLost,
    countryTwoUnitsLost,
    countryOneRemainingUnits,
    countryTwoRemainingUnits,
    isCountryOneWinner,
    isCountryTwoWinner,
  };
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

// Function to run the entire simulation
const runSimulation = (countryOneProfile, countryTwoProfile) => {
  const terrain = getRandomTerrain();
  const warResult = simulateWar(countryOneProfile, countryTwoProfile, terrain);

  let updatedCountryOneProfile = countryOneProfile;
  let updatedCountryTwoProfile = countryTwoProfile;

  if (warResult.isStalemate) {
    const countryOneUnitsLost = applyStalemateLossRate(countryOneProfile.units);
    const countryTwoUnitsLost = applyStalemateLossRate(countryTwoProfile.units);

    const countryOneRemainingUnits = calculateRemainingUnits(countryOneProfile.units, countryOneUnitsLost, false);
    const countryTwoRemainingUnits = calculateRemainingUnits(countryTwoProfile.units, countryTwoUnitsLost, false);

    updatedCountryOneProfile = {
      ...countryOneProfile,
      units: countryOneRemainingUnits,
    };
    updatedCountryTwoProfile = {
      ...countryTwoProfile,
      units: countryTwoRemainingUnits,
    };

    console.log("Stalemate");
    console.log("Country 1 units lost:", countryOneUnitsLost);
    console.log("Country 2 units lost:", countryTwoUnitsLost);
    console.log("Updated Country 1 profile:", updatedCountryOneProfile);
    console.log("Updated Country 2 profile:", updatedCountryTwoProfile);

  } else {
    const winner = warResult.isCountryOneWinner ? "Country 1" : "Country 2";
    const loser = warResult.isCountryTwoWinner ? "Country 1" : "Country 2";

    const winnerProfile = winner === "Country 1" ? countryOneProfile : countryTwoProfile;
    const loserProfile = winner === "Country 1" ? countryTwoProfile : countryOneProfile;

    const xpGain = rewardWinner(winnerProfile.profileStats.level, true, loserProfile.profileStats.level);
    const budgetIncrease = calculateBudgetIncrease(winnerProfile.profileStats.level, loserProfile.profileStats.level, 2500);

    const updatedProfileStats = {
      ...winnerProfile.profileStats,
      totalBattles: updateBattleStats(winnerProfile.profileStats.totalBattles, true),
      consecutiveWins: updateConsecutiveWins(winnerProfile.profileStats.consecutiveWins, true),
      highestEnemyLevelDefeated: updateHighestEnemyLevelDefeated(winnerProfile.profileStats.highestEnemyLevelDefeated, loserProfile.profileStats.level, true),
      firstVictory: updateFirstwin(winnerProfile.profileStats.firstvictory, true)
    };

    let updatedWinnerProfile = {
      ...winnerProfile,
      profileStats: updatedProfileStats
    };
 
    const updatedWinnerProfileWithXp = updateProfileXpAndLevel(updatedWinnerProfile, xpGain);
    const updatedWinnerProfileWithBudget = updateProfileBudget(updatedWinnerProfileWithXp, budgetIncrease);

    const winnerRemainingUnits = winner === "Country 1" ? warResult.countryOneRemainingUnits : warResult.countryTwoRemainingUnits;
    const loserRemainingUnits = winner === "Country 1" ? warResult.countryTwoRemainingUnits : warResult.countryOneRemainingUnits;

    updatedWinnerProfileWithBudget.units = winnerRemainingUnits;

    const updatedLoserProfile = { ...loserProfile, units: loserRemainingUnits };

    if (winner === "Country 1") {
      updatedCountryOneProfile = updatedWinnerProfileWithBudget;
      updatedCountryTwoProfile = updatedLoserProfile;
    } else {
      updatedCountryOneProfile = updatedLoserProfile;
      updatedCountryTwoProfile = updatedWinnerProfileWithBudget;
    }

    console.log('Country One Power', warResult.countryOneTotalPower);
    console.log('Country Two Power', warResult.countryTwoTotalPower);
    console.log(`Winner: ${winner}`);
    console.log(`Loser: ${loser}`);
    console.log("Winner Rewards:", { xpGain, budgetIncrease, updatedProfileStats });
    console.log("After Match Winner Profile:", updatedWinnerProfileWithBudget);
    console.log("After Match Loser Profile:", updatedLoserProfile);
  }

  return { updatedCountryOneProfile, updatedCountryTwoProfile };
};


module.exports = {
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};
