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

    const winnerProfile = warResult.isCountryOneWinner ? countryOneProfile : countryTwoProfile;
    const loserProfile = warResult.isCountryOneWinner ? countryTwoProfile : countryOneProfile;

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

    const winnerRemainingUnits = warResult.isCountryOneWinner ? warResult.countryOneRemainingUnits : warResult.countryTwoRemainingUnits;
    const loserRemainingUnits = warResult.isCountryOneWinner ? warResult.countryTwoRemainingUnits : warResult.countryOneRemainingUnits;

    updatedWinnerProfileWithBudget.units = winnerRemainingUnits;

    const updatedLoserProfile = { ...loserProfile, units: loserRemainingUnits };

    if (warResult.isCountryOneWinner) {
      updatedCountryOneProfile = updatedWinnerProfileWithBudget;
      updatedCountryTwoProfile = updatedLoserProfile;
    } else {
      updatedCountryOneProfile = updatedLoserProfile;
      updatedCountryTwoProfile = updatedWinnerProfileWithBudget;
    }

    console.log('Country One Power', warResult.countryOneTotalPower);
    console.log('Country Two Power', warResult.countryTwoTotalPower);
    console.log(`Winner: ${warResult.isCountryOneWinner ? 'Country 1' : 'Country 2'}`);
    console.log(`Loser: ${warResult.isCountryOneWinner ? 'Country 2' : 'Country 1'}`);
    console.log("Winner Rewards:", { xpGain, budgetIncrease, updatedProfileStats });
    console.log("After Match Winner Profile:", updatedWinnerProfileWithBudget);
    console.log("After Match Loser Profile:", updatedLoserProfile);
  }

  checkAndAwardAchievements(updatedCountryOneProfile, updatedCountryTwoProfile.profileStats.level);
  checkAndAwardAchievements(updatedCountryTwoProfile, updatedCountryOneProfile.profileStats.level);

  console.log('Achievement', updatedCountryOneProfile.profileStats.achievements)

  return { updatedCountryOneProfile, updatedCountryTwoProfile };
};

module.exports = {
  calculateMilitaryPower,
  simulateWar,
  runSimulation,
};