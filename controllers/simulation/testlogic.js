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
  updateTotalLosses,
} = require("./battleHelperFunc");

const simulateWar = (countryOne, countryTwo, terrain) => {
  const countryOneTotalPower = calculateMilitaryPower(countryOne, terrain);
  const countryTwoTotalPower = calculateMilitaryPower(countryTwo, terrain);

  console.log('total power country one:', countryOneTotalPower);
  console.log('total power country two:', countryTwoTotalPower);

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

  if (!countryOneProfile || !countryOneProfile.units) {
    throw new Error('Country one profile or units are not properly defined');
  }

  if (countryOneProfile.units.infantry === 0 && countryOneProfile.units.navy === 0 && countryOneProfile.units.airForce === 0 && countryOneProfile.units.technology === 0 && countryOneProfile.units.logistics === 0 && countryOneProfile.units.intelligence === 0) {
    return {
      message: 'Not enough units in the army',
      updatedCountryOneProfile: countryOneProfile,
      updatedCountryTwoProfile: countryTwoProfile,
      isCountryOneWinner: false,
      isCountryTwoWinner: false,
      isStalemate: false,
      rewards: null,
      loserRewards: null,
      matchStats: null,
    };
  }

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

    const countryOneRemainingUnits = calculateRemainingUnits(countryOneProfile.units, 0.05, false, true);
    const countryTwoRemainingUnits = calculateRemainingUnits(countryTwoProfile.units, 0.05, false, true);

    updatedCountryOneProfile = {
      ...countryOneProfile,
      units: countryOneRemainingUnits,
    };
    updatedCountryTwoProfile = {
      ...countryTwoProfile,
      units: countryTwoRemainingUnits,
    };

    const updatedProfileStats = {
      ...countryOneProfile.profileStats,
      totalBattles: updateBattleStats(countryOneProfile.profileStats.totalBattles, true),
      highestEnemyLevelDefeated: updateHighestEnemyLevelDefeated(countryOneProfile.profileStats.highestEnemyLevelDefeated, countryTwoProfile.profileStats.level, true),
      firstVictory: updateFirstwin(countryOneProfile.profileStats.firstvictory, true)
    };

    loserRewards = {
      xpGain: 500,
      budgetIncrease: 1000,
    };

    matchStats = {
      battleTotal: updatedProfileStats.totalBattles,
      totalWins: updatedProfileStats.total_wins,
    };

    const updatedLoserProfile = updateProfileXpAndLevel(updatedCountryOneProfile, loserRewards.xpGain);
    updatedCountryOneProfile = updateProfileBudget(updatedLoserProfile, loserRewards.budgetIncrease);

    const updatedLoserProfileTwo = updateProfileXpAndLevel(updatedCountryTwoProfile, loserRewards.xpGain);
    updatedCountryTwoProfile = updateProfileBudget(updatedLoserProfileTwo, loserRewards.budgetIncrease);

  } else if (warResult.isCountryOneWinner) {
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
      totalWins: updatedProfileStats.total_wins,
      total_losses: updatedProfileStats.total_losses
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

    const loserXpGain = 500;
    const loserBudget = 5000;

    const updatedLoserProfileTwo = updateProfileXpAndLevel(updatedCountryTwoProfile, loserXpGain);
    updatedCountryTwoProfile = updateProfileBudget(updatedLoserProfileTwo, loserBudget);

    loserRewards = {
      xpGain: loserXpGain,
      budgetIncrease: loserBudget
    };

  } else {
    const loserXpGain = 500;
    const loserBudget = 5000;

    const updatedProfileStats = {
      ...countryOneProfile.profileStats,
      totalBattles: updateBattleStats(countryOneProfile.profileStats.totalBattles, true),
      total_losses: updateTotalLosses(countryOneProfile.profileStats.total_losses, false)
    };

    matchStats = {
      battleTotal: updatedProfileStats.totalBattles,
      totalWins: updatedProfileStats.total_wins,
      total_losses: updatedProfileStats.total_losses
    };

    updatedCountryOneProfile = {
      ...countryOneProfile,
      profileStats: updatedProfileStats,
      units: warResult.countryOneRemainingUnits
    };

    updatedCountryTwoProfile.units = warResult.countryTwoRemainingUnits;

    const updatedLoserProfile = updateProfileXpAndLevel(updatedCountryOneProfile, loserXpGain);
    updatedCountryOneProfile = updateProfileBudget(updatedLoserProfile, loserBudget);

    const xpGain = rewardWinner(countryTwoProfile.profileStats.level, true, countryOneProfile.profileStats.level);
    const budgetIncrease = calculateBudgetIncrease(countryTwoProfile.profileStats.level, countryOneProfile.profileStats.level, 2500);

    const updatedProfileStatsTwo = {
      ...countryTwoProfile.profileStats,
      totalBattles: updateBattleStats(countryTwoProfile.profileStats.totalBattles, true),
      total_wins: updateTotalWins(countryTwoProfile.profileStats.total_wins, true),
      highestEnemyLevelDefeated: updateHighestEnemyLevelDefeated(countryTwoProfile.profileStats.highestEnemyLevelDefeated, countryOneProfile.profileStats.level, true),
      firstVictory: updateFirstwin(countryTwoProfile.profileStats.firstvictory, true)
    };

    let updatedWinnerProfile = {
      ...countryTwoProfile,
      profileStats: updatedProfileStatsTwo
    };

    const updatedWinnerProfileWithXp = updateProfileXpAndLevel(updatedWinnerProfile, xpGain);
    const updatedWinnerProfileWithBudget = updateProfileBudget(updatedWinnerProfileWithXp, budgetIncrease);

    updatedWinnerProfileWithBudget.units = warResult.countryTwoRemainingUnits;

    updatedCountryTwoProfile = updatedWinnerProfileWithBudget;

    rewards = {
      xpGain,
      budgetIncrease,
    };

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
    isCountryOneWinner: warResult.isCountryOneWinner,
    isStalemate: warResult.isStalemate,
  };
};

module.exports = {
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};