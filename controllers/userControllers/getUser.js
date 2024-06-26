const pool = require("../../database");

const getUser = async (req, res) => {
  try {
    const query = `
      SELECT
        u.id AS userId,
        u.username AS email,
        c.id AS countryId,
        c.name AS username,
        c.budget,
        u2.infantry,
        u2.navy,
        u2.airForce,
        u2.technology,
        u2.logistics,
        u2.intelligence,
        ps.level,
        ps.xp,
        ps.nextLevelXp,
        ps.totalBattles,
        ps.consecutiveWins,
        ps.highestEnemyLevelDefeated,
        ps.firstVictory
      FROM
        user u
        INNER JOIN country c ON u.id = c.user_id
        INNER JOIN units u2 ON c.id = u2.country_id
        INNER JOIN profile_stats ps ON c.id = ps.country_id
      LIMIT 1`;

    const [results] = await pool.query(query);

    if (results.length > 0) {
      const user = results[0];

      const profile = {
        budget: user.budget,
        units: {
          infantry: user.infantry,
          navy: user.navy,
          airForce: user.airForce,
          technology: user.technology,
          logistics: user.logistics,
          intelligence: user.intelligence,
        },
        profileStats: {
          level: user.level,
          xp: user.xp,
          nextLevelXp: user.nextLevelXp,
          totalBattles: user.totalBattles,
          consecutiveWins: user.consecutiveWins,
          highestEnemyLevelDefeated: user.highestEnemyLevelDefeated,
          firstVictory: user.firstVictory === 1,
        },
      };

      const responseData = {
        userId: user.userId,
        email: user.email,
        countryId: user.countryId,
        username: user.username,
        profile,
      };

      res.json(responseData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getUser;
