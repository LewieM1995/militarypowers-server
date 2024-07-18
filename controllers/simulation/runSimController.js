const pool = require("../../database");
const generateBattleReport = require("./generateBattleReport");
const { runSimulation } = require("./testlogic");
require("dotenv").config();

const runSimulationForClient = async (req, res) => {
  const { userId, email, countryId, name, profile, enemyProfile } = req.body;

  const userProfile = {
    userId,
    email,
    countryId,
    name,
    profile,
  };

  const enemyAIProfile = {
    budget: 0,
    type: "AI",
    id: enemyProfile.id,
    name: enemyProfile.name,
    level: enemyProfile.level,
    terrain: enemyProfile.terrain,
    units: {
      Riflemen: enemyProfile.Riflemen,
      Sniper: enemyProfile.Sniper,
      Medic: enemyProfile.Medic,
      AntiTank: enemyProfile.AntiTank,
      MachineGunner: enemyProfile.MachineGunner,
      Battleship: enemyProfile.Battleship,
      Destroyer: enemyProfile.Destroyer,
      Submarine: enemyProfile.Submarine,
      Frigate: enemyProfile.Frigate,
      Cruiser: enemyProfile.Cruiser,
      FighterJet: enemyProfile.FighterJet,
      Drone: enemyProfile.Drone,
      AttackHelicopter: enemyProfile.AttackHelicopter,
      Bomber: enemyProfile.Bomber,
      SatelliteSystems: enemyProfile.SatelliteSystems,
      Robotics: enemyProfile.Robotics,
      Biotechnology: enemyProfile.Biotechnology,
      Nanotechnology: enemyProfile.Nanotechnology,
      FieldHospital: enemyProfile.FieldHospital,
      AerialSupplyDrop: enemyProfile.AerialSupplyDrop,
      EngineeringCorp: enemyProfile.EngineeringCorp,
      MedicalEvacVehicle: enemyProfile.MedicalEvacVehicle,
      HumanIntel: enemyProfile.HumanIntel,
      CyberIntel: enemyProfile.CyberIntel,
      DroneSurveillanceUnit: enemyProfile.DroneSurveillanceUnit,
    },
    profileStats: {
      level: enemyProfile.level,
    },
  };

  try {
    const result = runSimulation(userProfile.profile, enemyAIProfile, enemyAIProfile.terrain);

    // Destructure result object
    const {
      updatedCountryOneProfile,
      isCountryOneWinner,
      isCountryTwoWinner,
      isStalemate,
      rewards,
      loserRewards,
      matchStats,
      message,
      countryOneTotalPower,
      countryTwoTotalPower
    } = result;

    // Handle the case where there are not enough units in the army
    if (message === 'Not enough units in the army') {
      return res.json({
        success: true,
        message: message,
        data: updatedCountryOneProfile,
        matchStats: matchStats,
        rewards: null,
        battleReport: null,
      });
    }

    // Queries for updating the database
    const updateCountryQuery = `
      UPDATE country
      SET budget = ?
      WHERE id = ?;
    `;

    const updateUnitsQuery = `
      UPDATE units
      SET Riflemen = ?, Sniper = ?, Medic = ?, AntiTank = ?, MachineGunner = ?, 
          Battleship = ?, Destroyer = ?, Submarine = ?, Frigate = ?, Cruiser = ?, 
          FighterJet = ?, Drone = ?, AttackHelicopter = ?, Bomber = ?, 
          SatelliteSystems = ?, Robotics = ?, Biotechnology = ?, Nanotechnology = ?, 
          FieldHospital = ?, AerialSupplyDrop = ?, EngineeringCorp = ?, MedicalEvacVehicle = ?, 
          HumanIntel = ?, CyberIntel = ?, DroneSurveillanceUnit = ?
      WHERE country_id = ?;
    `;

    const updateProfileStatsQuery = `
      UPDATE profile_stats
      SET level = ?, xp = ?, nextLevelXp = ?, totalBattles = ?, total_wins = ?, total_losses = ?, highestEnemyLevelDefeated = ?, firstVictory = ?
      WHERE country_id = ?;
    `;

    const insertUserAchievementQuery = `
      INSERT IGNORE INTO user_achievements (user_id, achievement_id, achieved_at)
      VALUES (?, ?, ?);
    `;

    const insertBattleReportQuery = `
      INSERT INTO battle_reports (user_id, enemy_name, units_lost, message, xp_gain, budget_increase)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check for NaN values before updating the database
      const { Riflemen, Sniper, Medic, AntiTank, MachineGunner, Battleship, Destroyer, Submarine, Frigate, Cruiser, FighterJet, Drone, AttackHelicopter, Bomber, SatelliteSystems, Robotics, Biotechnology, Nanotechnology, FieldHospital, AerialSupplyDrop, EngineeringCorp, MedicalEvacVehicle, HumanIntel, CyberIntel, DroneSurveillanceUnit } = updatedCountryOneProfile.units;
      const { level, xp, nextLevelXp, totalBattles, total_wins, total_losses, highestEnemyLevelDefeated, firstVictory } = updatedCountryOneProfile.profileStats;

      if ([Riflemen, Sniper, Medic, AntiTank, MachineGunner, Battleship, Destroyer, Submarine, Frigate, Cruiser, FighterJet, Drone, AttackHelicopter, Bomber, SatelliteSystems, Robotics, Biotechnology, Nanotechnology, FieldHospital, AerialSupplyDrop, EngineeringCorp, MedicalEvacVehicle, HumanIntel, CyberIntel, DroneSurveillanceUnit].some(isNaN)) {
        throw new Error("Invalid unit values: NaN detected");
      }

      if ([level, xp, nextLevelXp, totalBattles, total_wins, total_losses, highestEnemyLevelDefeated].some(isNaN)) {
        throw new Error("Invalid profile stats values: NaN detected");
      }

      // Update the user's profile (CountryOne) in the database
      await connection.query(updateCountryQuery, [updatedCountryOneProfile.budget, countryId]);
      await connection.query(updateUnitsQuery, [Riflemen, Sniper, Medic, AntiTank, MachineGunner, Battleship, Destroyer, Submarine, Frigate, Cruiser, FighterJet, Drone, AttackHelicopter, Bomber, SatelliteSystems, Robotics, Biotechnology, Nanotechnology, FieldHospital, AerialSupplyDrop, EngineeringCorp, MedicalEvacVehicle, HumanIntel, CyberIntel, DroneSurveillanceUnit, countryId]);
      await connection.query(updateProfileStatsQuery, [level, xp, nextLevelXp, totalBattles, total_wins, total_losses, highestEnemyLevelDefeated, firstVictory ? 1 : 0, countryId]);

      for (const achievement of updatedCountryOneProfile.profileStats.achievements) {
        await connection.query(insertUserAchievementQuery, [userId, achievement.id, new Date()]);
      }

      const unitsLostJson = JSON.stringify(matchStats.units_lost);

      // Insert the battle report into the database
      const battleXP = isCountryOneWinner ? rewards.xpGain : loserRewards.xpGain;
      const battleBudget = isCountryOneWinner ? rewards.budgetIncrease : loserRewards.budgetIncrease;
      await connection.query(insertBattleReportQuery, [userId, enemyAIProfile.name, unitsLostJson, message, battleXP, battleBudget]);

      await connection.commit();

      const battleReport = await generateBattleReport(userProfile, enemyAIProfile, message, countryOneTotalPower, countryTwoTotalPower);

      // Determine the response based on the outcome
      if (isStalemate) {
        res.json({
          success: true,
          message: "The battle ended in a stalemate.",
          data: updatedCountryOneProfile,
          matchStats: matchStats,
          rewards: loserRewards,
          battleReport: battleReport,
        });
      } else if (isCountryOneWinner) {
        res.json({
          success: true,
          message: "You won the battle!",
          data: updatedCountryOneProfile,
          rewards: rewards,
          matchStats: matchStats,
          battleReport: battleReport,
        });
      } else if (message === 'Not enough units in the army') {
        res.json({
          success: true,
          message: message,
          data: updatedCountryOneProfile,
          rewards: rewards,
          matchStats: matchStats,
          battleReport: battleReport,
        });
      } else {
        res.json({
          success: true,
          message: "You lost the battle",
          data: updatedCountryOneProfile,
          rewards: loserRewards,
          matchStats: matchStats,
          battleReport: battleReport,
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error("Error running simulation and updating database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error running simulation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { runSimulationForClient };
