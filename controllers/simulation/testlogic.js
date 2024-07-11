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
  updateTotalWins,
  updateHighestEnemyLevelDefeated,
  updateFirstwin,
  checkAndAwardAchievements,
} = require("./battleHelperFunc");

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

const runSimulation = (countryOneProfile, countryTwoProfile) => {
  const terrain = getRandomTerrain();
  const warResult = simulateWar(countryOneProfile, countryTwoProfile, terrain);

  let updatedCountryOneProfile = countryOneProfile;
  let updatedCountryTwoProfile = countryTwoProfile;
  let rewards = null;
  let loserRewards = null;
  let matchStats = null;

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

    loserRewards = 'The battle ended in a stalemate. Both sides suffered losses.';

  } else if (warResult.isCountryOneWinner) {
    // Handle CountryOne wins case
    const xpGain = rewardWinner(countryOneProfile.profileStats.level, true, countryTwoProfile.profileStats.level);
    const budgetIncrease = calculateBudgetIncrease(countryOneProfile.profileStats.level, countryTwoProfile.profileStats.level, 2500);

    const updatedProfileStats = {
      ...countryOneProfile.profileStats,
      totalBattles: updateBattleStats(countryOneProfile.profileStats.totalBattles, true),
      total_wins: updateTotalWins(countryOneProfile.profileStats.total_wins, true),
      highestEnemyLevelDefeated: updateHighestEnemyLevelDefeated(countryOneProfile.profileStats.highestEnemyLevelDefeated, countryTwoProfile.profileStats.level, true),
      firstVictory: updateFirstwin(countryOneProfile.profileStats.firstvictory, true)
    };

    matchStats = {
      battleTotal: updatedProfileStats.totalBattles,
      totalWins: updatedProfileStats.total_wins
    };

    let updatedWinnerProfile = {
      ...countryOneProfile,
      profileStats: updatedProfileStats
    };

    const updatedWinnerProfileWithXp = updateProfileXpAndLevel(updatedWinnerProfile, xpGain);
    const updatedWinnerProfileWithBudget = updateProfileBudget(updatedWinnerProfileWithXp, budgetIncrease);

    updatedWinnerProfileWithBudget.units = warResult.countryOneRemainingUnits;

    updatedCountryOneProfile = updatedWinnerProfileWithBudget;
    updatedCountryTwoProfile.units = warResult.countryTwoRemainingUnits;

    rewards = {
      xpGain,
      budgetIncrease,
    };

  } else {
    // Handle CountryOne loses case
    const loserXpGain = 5;  // Example xp gain for losing
    const loserBudget = 100;
    const updatedProfileStats = {
      ...countryOneProfile.profileStats,
      totalBattles: updateBattleStats(countryOneProfile.profileStats.totalBattles, true),
      total_wins: updateTotalWins(countryOneProfile.profileStats.total_wins, true),
    };

    matchStats = {
      battleTotal: updatedProfileStats.totalBattles,
      totalWins: updatedProfileStats.total_wins
    };

    updatedCountryOneProfile = {
      ...countryOneProfile,
      profileStats: updatedProfileStats,
      units: warResult.countryOneRemainingUnits
    };

    updatedCountryTwoProfile.units = warResult.countryTwoRemainingUnits;

    loserRewards = {
      xpGain: loserXpGain,
      budgetIncrease: loserBudget
    };
  }

  checkAndAwardAchievements(updatedCountryOneProfile, updatedCountryTwoProfile.profileStats.level);
  checkAndAwardAchievements(updatedCountryTwoProfile, updatedCountryOneProfile.profileStats.level);

  return {
    updatedCountryOneProfile,
    updatedCountryTwoProfile,
    matchStats,
    rewards,
    loserRewards,
    isCountryOneWinner: warResult.isCountryOneWinner
  };
};

module.exports = {
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};