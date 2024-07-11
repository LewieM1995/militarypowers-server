const pool = require('../../database');
const initialProfile = require('./initProfile');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get a database connection
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into user table
      const [userResults] = await connection.query(
        'INSERT INTO user (email, password) VALUES (?, ?)',
        [ email, hashedPassword]
      );
      const userId = userResults.insertId;

      // Insert into country table
      const [countryResults] = await connection.query(
        'INSERT INTO country (name, budget, user_id) VALUES (?, ?, ?)',
        [username, initialProfile.budget, userId]
      );
      const countryId = countryResults.insertId;

      // Insert into units table
      await connection.query(
        'INSERT INTO units (country_id, infantry, navy, airForce, technology, logistics, intelligence) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          countryId,
          initialProfile.units.infantry,
          initialProfile.units.navy,
          initialProfile.units.airForce,
          initialProfile.units.technology,
          initialProfile.units.logistics,
          initialProfile.units.intelligence,
        ]
      );

      // Insert into profile_stats table
      await connection.query(
        'INSERT INTO profile_stats (country_id, level, xp, nextLevelXp, totalBattles, consecutiveWins, highestEnemyLevelDefeated, firstVictory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          countryId,
          initialProfile.profileStats.level,
          initialProfile.profileStats.xp,
          initialProfile.profileStats.nextLevelXp,
          initialProfile.profileStats.totalBattles,
          initialProfile.profileStats.total_wins,
          initialProfile.profileStats.highestEnemyLevelDefeated,
          initialProfile.profileStats.firstVictory ? 1 : 0,
        ]
      );

      // Commit the transaction
      await connection.commit();
      res.json({ success: true });
    } catch (err) {
      await connection.rollback();
      console.error('Error during transaction:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error hashing password or getting connection:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = addUser;
