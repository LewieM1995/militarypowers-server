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
        u2.Riflemen,
        u2.Sniper,
        u2.Medic,
        u2.AntiTank,
        u2.MachineGunner,
        u2.Battleship,
        u2.Destroyer,
        u2.Submarine,
        u2.Frigate,
        u2.Cruiser,
        u2.FighterJet,
        u2.Drone,
        u2.AttackHelicopter,
        u2.Bomber,
        u2.SatelliteSystems,
        u2.Robotics,
        u2.Biotechnology,
        u2.Nanotechnology,
        u2.FieldHospital,
        u2.AerialSupplyDrop,
        u2.EngineeringCorp,
        u2.MedicalEvacVehicle,
        u2.HumanIntel,
        u2.CyberIntel,
        u2.DroneSurveillanceUnit,
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
          Riflemen: user.Riflemen,
          Sniper: user.Sniper,
          Medic: user.Medic,
          AntiTank: user.AntiTank,
          MachineGunner: user.MachineGunner,
          Battleship: user.Battleship,
          Destroyer: user.Destroyer,
          Submarine: user.Submarine,
          Frigate: user.Frigate,
          Cruiser: user.Cruiser,
          FighterJet: user.FighterJet,
          Drone: user.Drone,
          AttackHelicopter: user.AttackHelicopter,
          Bomber: user.Bomber,
          SatelliteSystems: user.SatelliteSystems,
          Robotics: user.Robotics,
          Biotechnology: user.Biotechnology,
          Nanotechnology: user.Nanotechnology,
          FieldHospital: user.FieldHospital,
          AerialSupplyDrop: user.AerialSupplyDrop,
          EngineeringCorp: user.EngineeringCorp,
          MedicalEvacVehicle: user.MedicalEvacVehicle,
          HumanIntel: user.HumanIntel,
          CyberIntel: user.CyberIntel,
          DroneSurveillanceUnit: user.DroneSurveillanceUnit,
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
