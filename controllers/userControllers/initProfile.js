const initialProfile = {
    budget: 50000,
    units: {
      infantry: 100,
      navy: 5,
      airForce: 50,
      technology: 10,
      logistics: 0,
      intelligence: 10,
    },
    profileStats: {
      level: 1,
      xp: 0,
      nextLevelXp: 500,
      totalBattles: 0,
      consecutiveWins: 0,
      highestEnemyLevelDefeated: 0,
      firstVictory: false,
    },
  };

  module.exports = initialProfile;