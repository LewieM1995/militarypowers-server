const pool = require('../../database');

// Function to check if a user exists
const checkUser = async (req, res) => {
  const {  email } = req.body;
  try {
    const [results] = await pool.query(`
      SELECT id AS userId, password AS passwordHash FROM user WHERE email = ?
    `, [email]);
    
    if (results.length > 0) {
      res.json({ exists: true, passwordHash: results[0].passwordHash, userId: results[0].userId });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = checkUser;
