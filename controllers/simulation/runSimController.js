const pool = require('../../database');
const { runSimulation } = require('./testlogic');

const runSimulationForClient = async (req, res) => {
  const { userId, email, countryId, username, profile, enemyProfile } = req.body;

  const userProfile = {
    userId,
    email,
    countryId,
    username,
    profile,
  };

  const enemyAIProfile = {
    budget: 0,
    type: 'AI',
    id: enemyProfile.id,
    name: enemyProfile.name,
    level: enemyProfile.level,
    units: {
      infantry: enemyProfile.infantry,
      navy: enemyProfile.navy,
      airForce: enemyProfile.airForce,
      technology: enemyProfile.technology,
      logistics: enemyProfile.logistics,
      intelligence: enemyProfile.intelligence,
    },
    profileStats: {
      level: enemyProfile.level
    }
  };

  try {
    const result = runSimulation(userProfile.profile, enemyAIProfile);

    const updatedCountryOneProfile = result.updatedCountryOneProfile;

    const isCountryOneWinner = result.isCountryOneWinner;
    console.log(isCountryOneWinner)
    const isStalemate = result.isStalemate;
    const rewards = result.rewards;
    const loserRewards = result.loserRewards;
    const matchStats = result.matchStats;

    console.log(matchStats);
    console.log(rewards);

    const updateCountryQuery = `
      UPDATE country
      SET budget = ?
      WHERE id = ?;
    `;

    const updateUnitsQuery = `
      UPDATE units
      SET infantry = ?, navy = ?, airForce = ?, technology = ?, logistics = ?, intelligence = ?
      WHERE country_id = ?;
    `;

    const updateProfileStatsQuery = `
      UPDATE profile_stats
      SET level = ?, xp = ?, nextLevelXp = ?, totalBattles = ?, total_wins = ?, highestEnemyLevelDefeated = ?, firstVictory = ?
      WHERE country_id = ?;
    `;

    const insertUserAchievementQuery = `
      INSERT IGNORE INTO user_achievements (user_id, achievement_id, achieved_at)
      VALUES (?, ?, ?);
    `;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update the user's profile (CountryOne) in the database
      await connection.query(updateCountryQuery, [updatedCountryOneProfile.budget, countryId]);
      await connection.query(updateUnitsQuery, [
        updatedCountryOneProfile.units.infantry,
        updatedCountryOneProfile.units.navy,
        updatedCountryOneProfile.units.airForce,
        updatedCountryOneProfile.units.technology,
        updatedCountryOneProfile.units.logistics,
        updatedCountryOneProfile.units.intelligence,
        countryId
      ]);
      await connection.query(updateProfileStatsQuery, [
        updatedCountryOneProfile.profileStats.level,
        updatedCountryOneProfile.profileStats.xp,
        updatedCountryOneProfile.profileStats.nextLevelXp,
        updatedCountryOneProfile.profileStats.totalBattles,
        updatedCountryOneProfile.profileStats.total_wins,
        updatedCountryOneProfile.profileStats.highestEnemyLevelDefeated,
        updatedCountryOneProfile.profileStats.firstVictory ? 1 : 0,
        countryId
      ]);

      for (const achievement of updatedCountryOneProfile.profileStats.achievements) {
        await connection.query(insertUserAchievementQuery, [userId, achievement.id, new Date()]);
      }

      await connection.commit();

      // Determine the response based on the outcome
      if (isStalemate) {
        res.json({
          success: true,
          message: 'Profile updated successfully in the database. The battle ended in a stalemate.',
          data: updatedCountryOneProfile,
          matchStats: matchStats
        });
      } else if (isCountryOneWinner) {
        res.json({
          success: true,
          message: 'Profile updated successfully in the database. You won the battle!',
          data: updatedCountryOneProfile,
          rewards: rewards,
          matchStats: matchStats
        });
      } else {
        res.json({
          success: true,
          message: 'Profile updated successfully in the database. You lost the battle.',
          data: updatedCountryOneProfile,
          rewards: loserRewards,
          matchStats: matchStats
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error('Error running simulation and updating database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error running simulation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { runSimulationForClient };
