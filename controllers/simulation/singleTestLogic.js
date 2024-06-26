const {
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
  checkAndAwardAchievements,
} = require("./battleHelperFunc");

const singlePlayerSimulatewar = (countryOne, enemyProfile, terrain) => {
  console.log(countryOne)
  const countryOneTotalPower = calculateMilitaryPower(countryOne, terrain);
  const enemyProfileTotalPower = calculateMilitaryPower(enemyProfile, terrain);

  const isCountryOneWinner = countryOneTotalPower > enemyProfileTotalPower;
  const isenemyProfileWinner = enemyProfileTotalPower > countryOneTotalPower;

  const lossPercentage = calculateLossPercentage(
    isCountryOneWinner ? countryOneTotalPower : enemyProfileTotalPower,
    isCountryOneWinner ? enemyProfileTotalPower : countryOneTotalPower
  );

  const countryOneRemainingUnits = calculateRemainingUnits(
    countryOne.units,
    lossPercentage,
    isCountryOneWinner
  );
  const enemyProfileRemainingUnits = calculateRemainingUnits(
    enemyProfile.units,
    lossPercentage,
    isenemyProfileWinner
  );

  const countryOneUnitsLost = calculateUnitsLost(
    countryOne.units,
    countryOneRemainingUnits
  );
  const enemyProfileUnitsLost = calculateUnitsLost(
    enemyProfile.units,
    enemyProfileRemainingUnits
  );

  const totalPower = countryOneTotalPower + enemyProfileTotalPower;
  const powerDifference = Math.abs(
    countryOneTotalPower - enemyProfileTotalPower
  );
  const stalemateThreshold = 0.015;

  const isStalemate = powerDifference < stalemateThreshold * totalPower;

  return {
    isStalemate,
    countryOneTotalPower,
    enemyProfileTotalPower,
    countryOneUnitsLost,
    enemyProfileUnitsLost,
    countryOneRemainingUnits,
    enemyProfileRemainingUnits,
    isCountryOneWinner,
    isenemyProfileWinner,
  };
};

const singlePlayerRunSim = (countryOneProfile, enemyProfileProfile) => {
  const terrain = getRandomTerrain();
  const warResult = singlePlayerSimulatewar(
    countryOneProfile,
    enemyProfileProfile,
    terrain
  );

  let updatedCountryOneProfile = { ...countryOneProfile }; // Copy countryOneProfile

  if (warResult.isStalemate) {
    const countryOneUnitsLost = applyStalemateLossRate(countryOneProfile.units);
    const countryOneRemainingUnits = calculateRemainingUnits(
      countryOneProfile.units,
      countryOneUnitsLost,
      false
    );

    updatedCountryOneProfile.units = countryOneRemainingUnits;

    console.log("Stalemate");
    console.log("Country 1 units lost:", countryOneUnitsLost);
    console.log("Country 2 units lost:", warResult.enemyProfileUnitsLost);
    console.log("Updated Country 1 profile:", updatedCountryOneProfile);
  } else if (warResult.isCountryOneWinner) {
    const xpGain = rewardWinner(
      countryOneProfile.profileStats.level,
      true,
      enemyProfileProfile.profileStats.level
    );
    const budgetIncrease = calculateBudgetIncrease(
      countryOneProfile.profileStats.level,
      enemyProfileProfile.profileStats.level,
      2500
    );

    const updatedProfileStats = {
      ...countryOneProfile.profileStats,
      totalBattles: updateBattleStats(
        countryOneProfile.profileStats.totalBattles,
        true
      ),
      consecutiveWins: updateConsecutiveWins(
        countryOneProfile.profileStats.consecutiveWins,
        true
      ),
      highestEnemyLevelDefeated: updateHighestEnemyLevelDefeated(
        countryOneProfile.profileStats.highestEnemyLevelDefeated,
        enemyProfileProfile.profileStats.level,
        true
      ),
      firstVictory: updateFirstwin(
        countryOneProfile.profileStats.firstvictory,
        true
      ),
    };

    const updatedCountryOneProfileWithXp = updateProfileXpAndLevel(
      { ...countryOneProfile, profileStats: updatedProfileStats },
      xpGain
    );
    const updatedCountryOneProfileWithBudget = updateProfileBudget(
      updatedCountryOneProfileWithXp,
      budgetIncrease
    );

    const winnerRemainingUnits = warResult.countryOneRemainingUnits;

    updatedCountryOneProfileWithBudget.units = winnerRemainingUnits;

    console.log("Country One Power", warResult.countryOneTotalPower);
    console.log("Country Two Power", warResult.enemyProfileTotalPower);
    console.log(`Winner: Country 1`);
    console.log(`Loser: Country 2`);
    console.log("Winner Rewards:", {
      xpGain,
      budgetIncrease,
      updatedProfileStats,
    });
    console.log(
      "After Match Winner Profile:",
      updatedCountryOneProfileWithBudget
    );
  }

  checkAndAwardAchievements(
    updatedCountryOneProfile,
    enemyProfileProfile.profileStats.level
  );

  return { updatedCountryOneProfile, enemyProfileProfile };
};

module.exports = {
  singlePlayerSimulatewar,
  singlePlayerRunSim,
};
