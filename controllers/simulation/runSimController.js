
const pool = require('../../database');
const { runSimulation } = require('./testlogic');

const runSimulationForClient = async (req, res) => {
  const { userId, email, countryId, username, profile, enemyProfile } = req.body;

  // Create a profile object to store the extracted data
  const userProfile = {
    userId,
    email,
    countryId,
    username,
    profile,
  };

  const enemyAIProfile = {
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
  }

  console.log(enemyAIProfile)

  try {
    // Generate enemy profiles and run the simulation
    const currentEnemyProfile = enemyAIProfile;

    // Check if the enemy profile is AI or player
    const isAIProfile = currentEnemyProfile.type === 'AI'; // Adjust this based on your actual enemy profile structure

      const result = runSimulation(userProfile.profile, currentEnemyProfile);
      const updatedCountryProfile = result.updatedCountryOneProfile;

      // Update the database with the new profile data
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
        SET level = ?, xp = ?, nextLevelXp = ?, totalBattles = ?, consecutiveWins = ?, highestEnemyLevelDefeated = ?, firstVictory = ?
        WHERE country_id = ?;
      `;

      // Start a transaction
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        await connection.query(updateCountryQuery, [updatedCountryProfile.budget, countryId]);
        await connection.query(updateUnitsQuery, [
          updatedCountryProfile.units.infantry, 
          updatedCountryProfile.units.navy, 
          updatedCountryProfile.units.airForce,
          updatedCountryProfile.units.technology, 
          updatedCountryProfile.units.logistics, 
          updatedCountryProfile.units.intelligence, 
          countryId
        ]);
        await connection.query(updateProfileStatsQuery, [
          updatedCountryProfile.profileStats.level, 
          updatedCountryProfile.profileStats.xp, 
          updatedCountryProfile.profileStats.nextLevelXp,
          updatedCountryProfile.profileStats.totalBattles, 
          updatedCountryProfile.profileStats.consecutiveWins, 
          updatedCountryProfile.profileStats.highestEnemyLevelDefeated, 
          updatedCountryProfile.profileStats.firstVictory ? 1 : 0, 
          countryId
        ]);

        // Commit the transaction
        await connection.commit();
        //console.log('updatedCountryProfile', updatedCountryProfile)
        res.json({ success: true, message: 'Profile updated successfully in the database.', data: updatedCountryProfile });
      } catch (error) {
        // Rollback the transaction in case of error
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
