const {generateEnemyProfiles} = require('../../enemyBattles')
const {singlePlayerRunSim} = require('./singleTestLogic')

const runSPSimulation = async (req, res) => {
    const { userId, email, countryId, username, profile } = req.body;
  
    // Create a profile object to store the extracted data
    const userProfile = {
      userId,
      email,
      countryId,
      username,
      profile
    };
  
    try {
      // Assuming these functions are correctly defined and working
      const enemyProfiles = generateEnemyProfiles();
      const currentEnemyProfile = enemyProfiles[0];
      const result = singlePlayerRunSim(userProfile.profile, currentEnemyProfile);
      const updatedCountryProfile = result.updatedCountryOneProfile;
  
      res.json({ success: true, updatedCountryProfile });
    } catch (error) {
      console.error('Error running simulation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { runSPSimulation };
  
