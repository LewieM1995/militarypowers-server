const pool = require('../../database');

// Function to check if a user exists
const checkUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const results = await pool.query(
      'SELECT * FROM user WHERE username = ? AND password = ?',
      [email, password]
    );

    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = checkUser;
