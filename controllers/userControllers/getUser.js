const pool = require("../../database");
const { format } = require('date-fns');

const getUser = async (req, res) => {
  try {
    const { email } = req.params;  // Extract email from request parameters

    if (!email) {
      return res.status(400).json({ error: "email is required" });  // Validate email
    }

    const query = `
      SELECT
        u.id AS userId,
        u.email AS email,
        c.id AS countryId,
        c.name AS name,
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
        ps.total_wins,
        ps.total_losses,
        ps.highestEnemyLevelDefeated,
        ps.firstVictory,
        a.id AS achievementId,
        a.name AS achievementName,
        a.description AS achievementDescription,
        ua.achieved_at AS achievedAt  -- Fix the typo and ensure the correct table alias
      FROM
        user u
        INNER JOIN country c ON u.id = c.user_id
        INNER JOIN units u2 ON c.id = u2.country_id
        INNER JOIN profile_stats ps ON c.id = ps.country_id
        LEFT JOIN user_achievements ua ON u.id = ua.user_id
        LEFT JOIN achievements a ON ua.achievement_id = a.id
      WHERE
        u.email = ?
    `;

    const [results] = await pool.query(query, [email]);  // Pass the email as a parameter

    if (results.length > 0) {
      // Extract user data
      const user = results[0];

      // Collect achievements, ensuring to avoid duplicates
      const achievements = results
        .filter(row => row.achievementId)  // Filter out rows without achievement data
        .map(row => ({
          id: row.achievementId,
          name: row.achievementName,
          description: row.achievementDescription,
          date: format(new Date(row.achievedAt), 'MMMM d, yyyy')
        }))
        .reduce((uniqueAchievements, current) => {
          if (!uniqueAchievements.find(achievement => achievement.id === current.id)) {
            uniqueAchievements.push(current);
          }
          return uniqueAchievements;
        }, []);

      // Construct the profile object
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
          total_wins: user.total_wins,
          total_losses: user.total_losses,
          highestEnemyLevelDefeated: user.highestEnemyLevelDefeated,
          firstVictory: user.firstVictory === 1,
          achievements,  // Add achievements here
        },
      };

      // Construct the response data
      const responseData = {
        name: user.name,
        userId: user.userId,
        email: user.email,
        countryId: user.countryId,
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
