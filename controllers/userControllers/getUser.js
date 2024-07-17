const pool = require("../../database");
const { format } = require('date-fns');

const getUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "email is required" });  // Validate email
    }

    const query = `
      WITH recent_battle_reports AS (
        SELECT *
        FROM battle_reports
        WHERE user_id = (SELECT id FROM user WHERE email = ?)
        ORDER BY created_at DESC
        LIMIT 5
      )
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
        ua.achieved_at AS achievedAt,
        br.enemy_name as enemy_name,
        br.units_lost as units_lost,
        br.message as message,
        br.xp_gain as xpGain,
        br.budget_increase as budgetIncrease,
        br.created_at as br_created_at
      FROM
        user u
        INNER JOIN country c ON u.id = c.user_id
        INNER JOIN units u2 ON c.id = u2.country_id
        INNER JOIN profile_stats ps ON c.id = ps.country_id
        LEFT JOIN user_achievements ua ON u.id = ua.user_id
        LEFT JOIN achievements a ON ua.achievement_id = a.id
        LEFT JOIN recent_battle_reports br ON u.id = br.user_id
      WHERE
        u.email = ?
    `;

    const [results] = await pool.query(query, [email, email]);

    if (results.length > 0) {
      const user = results[0];

      const achievements = results
        .filter(row => row.achievementId)
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

      const battleReports = results
        .filter(row => row.br_created_at)
        .map(row => ({
          enemy_name: row.enemy_name,
          units_lost: row.units_lost,
          br_message: row.message,
          br_xpGain: row.xpGain,
          br_budgetInc: row.budgetIncrease,
          br_created_at: format(new Date(row.br_created_at), 'MMMM d, yyyy HH:mm:ss')
        })).slice(0, 5);

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
          achievements,
        },
        battleReports
      };

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
