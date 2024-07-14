const pool = require("../../database");
const { runSimulation } = require("./testlogic");
require("dotenv").config();
const OpenAI = require("openai");

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    units: {
      infantry: enemyProfile.infantry,
      navy: enemyProfile.navy,
      airForce: enemyProfile.airForce,
      technology: enemyProfile.technology,
      logistics: enemyProfile.logistics,
      intelligence: enemyProfile.intelligence,
    },
    profileStats: {
      level: enemyProfile.level,
    },
  };

  try {
    // Run the simulation
    const result = runSimulation(userProfile.profile, enemyAIProfile);

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
    } = result;

    // Handle the case where there are not enough units in the army
    if (message === 'Not enough units in the army') {
      return res.json({
        success: true,
        message: 'Not enough units in the army',
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
      SET infantry = ?, navy = ?, airForce = ?, technology = ?, logistics = ?, intelligence = ?
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

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check for NaN values before updating the database
      const { infantry, navy, airForce, technology, logistics, intelligence } = updatedCountryOneProfile.units;
      const { level, xp, nextLevelXp, totalBattles, total_wins, total_losses, highestEnemyLevelDefeated, firstVictory } = updatedCountryOneProfile.profileStats;

      if ([infantry, navy, airForce, technology, logistics, intelligence].some(isNaN)) {
        throw new Error("Invalid unit values: NaN detected");
      }

      if ([level, xp, nextLevelXp, totalBattles, total_wins, total_losses, highestEnemyLevelDefeated].some(isNaN)) {
        throw new Error("Invalid profile stats values: NaN detected");
      }

      // Update the user's profile (CountryOne) in the database
      await connection.query(updateCountryQuery, [updatedCountryOneProfile.budget, countryId]);
      await connection.query(updateUnitsQuery, [infantry, navy, airForce, technology, logistics, intelligence, countryId]);
      await connection.query(updateProfileStatsQuery, [level, xp, nextLevelXp, totalBattles, total_wins, total_losses, highestEnemyLevelDefeated, firstVictory ? 1 : 0, countryId]);

      for (const achievement of updatedCountryOneProfile.profileStats.achievements) {
        await connection.query(insertUserAchievementQuery, [userId, achievement.id, new Date()]);
      }

      await connection.commit();

      // Function to delay execution
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      // Generate the battle report
      const chatGPTPrompt = `
        Generate a detailed battle report based on the following outcome:
        - ${JSON.stringify(userProfile.name)}: ${JSON.stringify(userProfile.profile.units)}
        - ${JSON.stringify(enemyAIProfile.name)}: ${JSON.stringify(enemyAIProfile.units)}
        - Message: ${message}

        Provide a compelling narrative of the battle including key events, strategies used, and the final outcome. 
        Don't mention the budget. Never mention Profile levels.

        Break the report down into the following sections:

        1. **Introduction**
          - Brief overview of the battle setup and the main competitors.
          
        2. **Unit Comparison**
          - Compare the units of both sides (infantry, navy, air force, technology, logistics, intelligence).
          - Compare units in a terse and concise manner, this part does not need to be narratively driven.

        3. **Key Events**
          - Highlight major events and turning points in the battle.

        4. **Strategies Used**
          - Discuss the strategies employed by both sides.

        5. **Outcome**
          - Summarize the final outcome of the battle.

        Please ensure each section is clearly labeled and the content is concise.
      `;

      await delay(1000);

      try {
        const chatGPTResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: chatGPTPrompt },
          ],
        });

        const battleReport = chatGPTResponse.choices[0].message.content.trim();

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
        } else if (message) {
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
        if (error.code === "insufficient_quota") {
          console.error("Rate limit error:", error.message);
          res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
        } else {
          console.error("Error generating battle report:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
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
