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

const stalemateLossRate = 0.05;
const applyStalemateLossRate = (units) => {
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
  let countryOneUnitsLost;
  let countryTwoUnitsLost;

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

  countryOneUnitsLost = calculateUnitsLost(
    countryOne.units,
    countryOneRemainingUnits
  );
  countryTwoUnitsLost = calculateUnitsLost(
    countryTwo.units,
    countryTwoRemainingUnits
  );

  const totalPower = countryOneTotalPower + countryTwoTotalPower;
  const powerDifference = Math.abs(countryOneTotalPower - countryTwoTotalPower);
  const stalemateThreshold = 0.02;

  if (powerDifference < stalemateThreshold * totalPower) {
    const countryOneUnitsLost = applyStalemateLossRate(countryOne.units);
    const countryTwoUnitsLost = applyStalemateLossRate(countryTwo.units);

    updateDOMWithResults(
      "Stalemate",
      "Stalemate",
      terrain,
      countryOneTotalPower,
      countryTwoTotalPower,
      countryOneUnitsLost,
      countryTwoUnitsLost,
      calculateRemainingUnits(countryOne.units, stalemateLossRate),
      calculateRemainingUnits(countryTwo.units, stalemateLossRate)
    );

    return {
      winner: "Stalemate",
      loser: "Stalemate",
      terrain,
      countryOneTotalPower,
      countryTwoTotalPower,
      countryOneUnitsLost,
      countryTwoUnitsLost,
      countryOneRemainingUnits: calculateRemainingUnits(
        countryOne.units,
        stalemateLossRate
      ),
      countryTwoRemainingUnits: calculateRemainingUnits(
        countryTwo.units,
        stalemateLossRate
      ),
    };
  }

  let winner = isCountryOneWinner
    ? "Country 1"
    : isCountryTwoWinner
    ? "Country 2"
    : "Stalemate";
  let loser = isCountryOneWinner
    ? "Country 2"
    : isCountryTwoWinner
    ? "Country 1"
    : "Stalemate";

  if (winner !== "Stalemate") {
    const winnerProfile = winner === "Country 1" ? countryOne : countryTwo;
    const loserProfile = winner === "Country 1" ? countryTwo : countryOne;

    // calc xp reward func
    const xpGain = rewardWinner(
      winnerProfile.profileStats.level,
      true,
      loserProfile.profileStats.level
    );

    // calc budget func
    const budgetIncrease = calculateBudgetIncrease(
      winnerProfile.profileStats.level,
      loserProfile.profileStats.level,
      2500
    );

    winnerStats = { xpGain, budgetIncrease };
  }

  /* updateDOMWithResults(
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
  ); */

  return {
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

// Function to run the entire simulation
const runSimulation = (countryOneProfile, countryTwoProfile) => {
  const terrain = getRandomTerrain();
  const warResult = simulateWar(countryOneProfile, countryTwoProfile, terrain);

  let updatedCountryOneProfile = countryOneProfile;
  let updatedCountryTwoProfile = countryTwoProfile;

  if (warResult.winner !== "Stalemate") {
    const winnerProfile = warResult.winner === "Country 1" ? countryOneProfile : countryTwoProfile;
    const loserProfile = warResult.winner === "Country 1" ? countryTwoProfile : countryOneProfile;

    console.log("Before Match Winner Profile:", winnerProfile);
    console.log("Before Match Loser Profile:", loserProfile);

    const updatedWinnerProfile = updateProfileXpAndLevel(winnerProfile, warResult.winnerStats.xpGain);
    const updatedWinnerProfileWithBudget = updateProfileBudget(updatedWinnerProfile, warResult.winnerStats.budgetIncrease);

    const winnerRemainingUnits = warResult.winner === "Country 1" ? warResult.countryOneRemainingUnits : warResult.countryTwoRemainingUnits;
    const loserRemainingUnits = warResult.winner === "Country 1" ? warResult.countryTwoRemainingUnits : warResult.countryOneRemainingUnits;

    updatedWinnerProfileWithBudget.units = winnerRemainingUnits;

    const updatedLoserProfile = { ...loserProfile, units: loserRemainingUnits };

    if (warResult.winner === "Country 1") {
      updatedCountryOneProfile = updatedWinnerProfileWithBudget;
      updatedCountryTwoProfile = updatedLoserProfile;
    } else {
      updatedCountryOneProfile = updatedLoserProfile;
      updatedCountryTwoProfile = updatedWinnerProfileWithBudget;
    }

    console.log("Winner Rewards:", warResult.winnerStats);
    console.log("After Match Winner Profile:", updatedWinnerProfileWithBudget);
    console.log("After Match Loser Profile:", updatedLoserProfile);

    /*
    const matchResultHtml = `
      <div>
        <h3>Match Result</h3>
        <p>Winner: ${warResult.winner}</p>
        <p>Loser: ${warResult.loser}</p>
        <p>Terrain: ${warResult.terrain}</p>
        <p>Power (1): ${warResult.countryOneTotalPower}</p>
        <p>Power (2): ${warResult.countryTwoTotalPower}</p>
        <p>Lost Units (1): ${JSON.stringify(warResult.countryOneUnitsLost)}</p>
        <p>Lost Units (2): ${JSON.stringify(warResult.countryTwoUnitsLost)}</p>
        <p>Remaining (1): ${JSON.stringify(warResult.countryOneRemainingUnits)}</p>
        <p>Remaining (2): ${JSON.stringify(warResult.countryTwoRemainingUnits)}</p>
        <p>Winner Rewards: ${JSON.stringify(warResult.winnerStats)}</p>
        <p>Updated Winner Profile: ${JSON.stringify(updatedWinnerProfileWithBudget)}</p>
        <p>Updated Loser Profile: ${JSON.stringify(updatedLoserProfile)}</p>
      </div>
    `; 

    // Append the match result HTML to the matchResults div
    const matchResultsDiv = document.getElementById('matchResults');
    matchResultsDiv.insertAdjacentHTML('beforeend', matchResultHtml); */
  }

  return { updatedCountryOneProfile, updatedCountryTwoProfile };
};


module.exports = {
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};
